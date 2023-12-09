const express = require('express');
const router = express.Router();
const GameSession = require('../src/models/GameSession');
const { v4: uuidv4 } = require('uuid');

// Create a new game session
router.post('/', async (req, res) => {
  const { playerName } = req.body;
  try {
    const sessionId = uuidv4();
    const newSession = new GameSession({
      sessionId: sessionId,
      players: [], // Initialize with no players
      playerNames: [playerName],
      currentPlayer: 'X' // This will be the first player by default.
    });
    await newSession.save();
    res.status(201).json(newSession);
  } catch (error) {
    console.error("Error in POST /api/sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all game sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await GameSession.find();
    res.json(sessions);
  } catch (error) {
    console.error("Error in GET /api/sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get a specific game session
router.get('/:id', async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json(session);
  } catch (error) {
    console.error("Error in GET /api/sessions/:id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Make a move in a game session
router.put('/:id/move', async (req, res) => {
  const { id } = req.params;
  const { player, position } = req.body;

  try {
    const session = await GameSession.findById(id);
    if (!session || session.status !== 'in_progress') {
      return res.status(404).json({ message: 'Session not found or not in progress' });
    }

    const isMoveValid = session.makeMove(player, position);
    if (!isMoveValid) {
      return res.status(400).json({ message: 'Invalid move' });
    }

    await session.save();
    res.json(session);
  } catch (error) {
    console.error("Error in PUT /api/sessions/:id/move:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get the state of a specific game session
router.get('/:_id/state', async (req, res) => {
  try {
    const { _id } = req.params;
    const session = await GameSession.findById(_id);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }


    const gameState = session.getCurrentState();

    res.json(gameState);
  } catch (error) {
    console.error("Error in GET /api/sessions/:sessionId/state:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Endpoint to join a game session
router.post('/:id/join', async (req, res) => {
  try {
    const { playerName } = req.body;
    const session = await GameSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.playerNames.includes(playerName)) {
      return res.status(400).json({ message: 'Player already in session' });
    }

    session.playerNames.push(playerName); // Add the player name to the session

    // Here we call the joinSession method which should be defined in your GameSession model.
    const joined = session.joinSession(playerName);
    if (!joined) {
      return res.status(400).json({ message: 'Cannot join session' });
    }
    
    // Check if we now have two players, if so, update the session status to 'in_progress'
    if (session.players.length === 2) {
      session.status = 'in_progress';
    }

    await session.save();
    res.json(session);
  } catch (error) {
    console.error("Error in POST /api/sessions/:id/join:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
