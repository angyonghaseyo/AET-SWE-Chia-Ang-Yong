# Accessible Tic-Tac-Toe Web Application
Welcome to our acessible Tic Tac Toe web application — an interactive, real-time, multiplayer game built with modern web technologies. This application is designed to provide an engaging gaming experience for everyone.

## Key Features

- **Multiplayer Gameplay**: Challenge friends or other online users in real-time matches.
- **Real-Time Updates**: Experience seamless gameplay with instant updates on every move, thanks to WebSocket technology.
- **Intuitive Interface**: Our React-based UI is user-friendly, ensuring that players of all ages can navigate and enjoy the game with ease.
- **Session Management**: Join existing games or create new ones with a simple click, and track your game's progress effortlessly.

## Accessibility Features

Our Tic Tac Toe web application is designed with accessibility in mind, ensuring that all players have a user-friendly experience. Here are our key accessibility features:

- **Simple User Identification**: Instead of complex authentication processes, users can start playing by simply typing in their name. This makes the game quickly accessible while still personalizing the experience as all game data is linked to the user's name.
- **Screen Reader Support**: Our application supports screen readers, with the game instructions read aloud when users hover over text elements. This ensures that visually impaired users can understand how to play the game without seeing the screen.
- **Descriptive Audio Feedback**: As part of our commitment to accessible gaming, our application provides audio feedback on the state of the game board. The screen reader announces the row and column of each cell, as well as which player has made a mark there, allowing visually impaired users to track the game's progress audibly.
- **Voice Command Functionality (Coming Soon)**: We are working on implementing voice command functionality to allow users to control gameplay through spoken instructions. This hands-free feature will enhance accessibility and ease of use for all users, especially those who rely on voice navigation.

## Technology Stack

- **Frontend**: React.js for dynamic component rendering.
- **Backend**: Node.js with Express.js for API management and WebSocket connections.
- **Database**: MongoDB for persistent data storage.
- **Real-Time Communication**: Socket.IO for real-time bidirectional event-based communication.

Enjoy the game, and may the best player win!

## Prerequisites

Before you start, ensure you have the following installed:
- Node.js and npm (Node Package Manager)
- MongoDB (for local database usage)
- 2 modern web browsers (e.g., Chrome, Safari)

## Initial Setup

### 1. Clone the Repository
Clone your project's Git repository to your local machine, or ensure all project files are present locally.

### 2. Install Dependencies
- Navigate to your project's root directory in the terminal.
- Run `npm install` to install backend dependencies.
- If you have a separate frontend directory, navigate there and run `npm install` as well.

### 3. Database Setup
- Make sure MongoDB is running on your machine.
- Configure the MongoDB URI in your application settings (check `server.js` or environment variables).

### 4. Environment Variables
Set up required environment variables, such as `REACT_APP_SERVER_URL`, to point to your backend server.

### 5. Start the Backend Server
- At the root of your backend project, run `node server.js` in the terminal to start the server.

### 6. Start the Frontend Application
- Open a new terminal, navigate to your frontend directory, and run `npm start` to launch the application.

## Playing the Game

### 1. Load the Application
Open your web browser and go to the URL where the React application is running, typically `http://localhost:3000`.

### 2. Create a Game Session
- On the homepage, click the "Create Game Session" button or similar.
- A new game session should be created, possibly redirecting you to a waiting room or game board.

### 3. Join the Game Session in Another Browser
- Open a different browser or an incognito window.
- Navigate to `http://localhost:3000`.
- Enter a username if required and join the created game session.

### 4. Play the Game
- The game starts, and players take turns making moves.
- Continue until there's a winner or a draw.

### 5. End the Game
- The game concludes with a win or draw announcement.
- Choose to play again or end the session.

## Screen Capture a video walking through how a person with sensory impairment would interact with the game
[Accessible Tic Tac Toe](https://youtu.be/YVicHqvCod8)



## API Functions/Specifications

### 1. Create a New Game Session

- **Endpoint:** `/api/sessions`
- **Method:** POST
- **Body Parameters:**
  - `playerName`: String (name of the player creating the session)
- **Response:**
  - A new game session object with details including `sessionId`, `players`, `currentState`, etc.
- **cURL Example:**
  ```bash
  curl -X POST http://localhost:5000/api/sessions \
  -H 'Content-Type: application/json' \
  -d '{"playerName": "Alice"}'
  ```
- **Postman Example:**
  - Set the method to POST, URL to `http://localhost:5000/api/sessions`. In the Body section, select `raw` and `JSON`, then input `{"playerName": "Alice"}`.

### 2. Get All Game Sessions

- **Endpoint:** `/api/sessions`
- **Method:** GET
- **Response:**
  - An array of all game session objects.
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:5000/api/sessions
  ```
- **Postman Example:**
  - Set the method to GET and URL to `http://localhost:5000/api/sessions`.

### 3. Get Specific Game Session

- **Endpoint:** `/api/sessions/:id`
- **Method:** GET
- **URL Parameters:**
  - `id`: Session ID
- **Response:**
  - The game session object corresponding to the provided ID.
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:5000/api/sessions/{sessionId}
  ```
- **Postman Example:**
  - Set the method to GET and URL to `http://localhost:5000/api/sessions/{sessionId}`. Replace `{sessionId}` with the actual session ID.

### 4. Make a Move in a Game Session

- **Endpoint:** `/api/sessions/:id/move`
- **Method:** PUT
- **URL Parameters:**
  - `id`: Session ID
- **Body Parameters:**
  - `player`: 'X' or 'O'
  - `position`: Index on the board (0-8)
- **Response:**
  - The updated game session object after the move.
- **cURL Example:**
  ```bash
  curl -X PUT http://localhost:5000/api/sessions/{sessionId}/move \
  -H 'Content-Type: application/json' \
  -d '{"player": "X", "position": 4}'
  ```
- **Postman Example:**
  - Set the method to PUT, URL to `http://localhost:5000/api/sessions/{sessionId}/move`. In the Body section, select `raw` and `JSON`, then input `{"player": "X", "position": 4}`.

### 5. Get Game State of a Specific Session

- **Endpoint:** `/api/sessions/:_id/state`
- **Method:** GET
- **URL Parameters:**
  - `_id`: Session ID
- **Response:**
  - Current game state of the specified session.
- **cURL Example:**
  ```bash
  curl -X GET http://localhost:5000/api/sessions/{sessionId}/state
  ```
- **Postman Example:**
  - Set the method to GET and URL to `http://localhost:5000/api/sessions/{sessionId}/state`.

### 6. Join a Game Session

- **Endpoint:** `/api/sessions/:id/join`
- **Method:** POST
- **URL Parameters:**
  - `id`: Session ID
- **Body Parameters:**
  - `playerName`: String
- **Response:**
  - The updated game session object after joining.
- **cURL Example:**
  ```bash
  curl -X POST http://localhost:5000/api/sessions/{sessionId}/join \
  -H 'Content-Type: application/json' \
  -d '{"playerName": "Bob"}'
  ```
- **Postman Example:**
  - Set the method to POST, URL to `http://localhost:5000/api/sessions/{sessionId}/join`. In the Body section, select `raw` and `JSON`, then input `{"playerName": "Bob"}`.


## Summary of Design/Infrastructure Decisions and Accessibility Considerations

In designing the Tic-Tac-Toe web application, a strong emphasis was placed on accessibility to ensure an inclusive and barrier-free gaming experience for all users. The decision to employ a username-based system for user identification, bypassing the complexities of a traditional authentication process, significantly lowers the entry threshold for players. This approach not only speeds up the onboarding process but also makes the game more approachable, especially for users who might find account creation and management challenging.

For the backend, MongoDB was chosen for its flexible data schema, which is particularly beneficial for storing varied user data and game states. This adaptability in data handling is essential in creating a responsive and seamless gaming experience. Coupled with Node.js and Express, this setup provides a robust infrastructure capable of handling real-time interactions, a critical aspect of multiplayer online games.

The frontend, developed with React, enhances user interaction through a responsive and dynamic interface. React's capacity to manage stateful components and efficiently update the DOM in response to user actions contributes to a smooth and accessible user experience.

A significant portion of the development effort was dedicated to implementing accessibility features. The application is designed to be compatible with screen readers, enabling visually impaired users to navigate and interact with the game effectively. Additionally, functionalities to audibly read the board and announce game states were integrated. These features not only aid users with visual impairments but also enhance the overall user experience by adding an auditory dimension to the game.

Overall, the application's design is a thoughtful blend of technology and accessibility considerations. By prioritizing user-friendliness through a simplified login process, leveraging a flexible and efficient technology stack, and incorporating key accessibility features, the Tic-Tac-Toe game stands as an inclusive and engaging platform, welcoming a diverse range of players to enjoy this classic game.


## Architecture Diagram
<img width="1002" alt="Architecture" src="https://github.com/angyonghaseyo/AET-SWE-Chia-Ang-Yong/assets/89739997/99a8b4e4-9424-4a9d-9515-4a676369db34">
User Interface (React Frontend): This is the client-side of the application where the users interact with the application through its UI components. It consists of TicTacToeBoard, GameList, and WaitingRoom components.

API Calls: The React frontend communicates with the backend application layer using API calls. These are likely HTTP requests sent to the Node.js/Express server.

Real-time Updates: Alongside API calls, there is a WebSocket connection established for real-time updates. This would be important for a game like Tic Tac Toe to update the game board in real-time without needing to refresh the page.

Application Layer (Node.js/Express): This layer handles the logic of the application, processes API calls, manages WebSocket connections, and interacts with the database. It serves as the intermediary between the frontend and the database.

Data Queries: This represents the interactions between the application layer and the database, where data is queried, retrieved, stored, and updated in the MongoDB database.

Database Layer (MongoDB): This is the data storage layer of the application. It holds the data needed by the application, such as game sessions, user accounts, game states, etc.

