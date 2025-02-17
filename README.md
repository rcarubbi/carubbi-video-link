# Carubbi Video Link

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Description

**Carubbi Video Link** is a web application demonstrating the use of WebRTC to establish peer-to-peer (P2P) video calls directly between browsers, eliminating the need for plugins or intermediary media servers.

## Features

- **P2P Video Calls:** Establish direct video connections between two browsers.
- **User-Friendly Interface:** Simple and intuitive user interface for ease of use.
- **Device Configuration:** Select and configure audio and video devices before initiating a call.

## Technologies Used

- **Frontend:**
  - HTML5, CSS3, and JavaScript
  - [Tailwind](https://tailwindcss.com/) for styling the user interface
- **Backend:**
  - [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) for the signaling server
- **Real-Time Communication:**
  - [WebRTC](https://webrtc.org/) for audio and video streaming
  - [Socket.IO](https://socket.io/) for real-time signaling between peers

## Prerequisites

- [Node.js](https://nodejs.org/) version 20 or higher
- [pnpm](https://pnpm.io/) as the package manager

## How to Run the Project

1. **Clone the repository:**

   ```
   git clone https://github.com/rcarubbi/carubbi-video-link.git
   cd carubbi-video-link
   ```

2. **Install dependencies:**

   ```
   pnpm install
   ```

3. **Start the signaling server:**

   ```
   cd server
   pnpm run dev
   ```

4. **Start the client:**

   In another terminal, execute:

   ```
   cd client
   pnpm run dev
   ```

5. **Access the application:**

   Open your browser and navigate to `http://localhost:5173`.

## Project Structure

- **client/**: Contains the React frontend source code.
- **server/**: Contains the Node.js backend source code with Express and Socket.IO.
- **docker-compose.yml**: Configuration file to set up and start services using Docker Compose.

## Docker

To run the application using Docker, ensure you have Docker and Docker Compose installed. Then, execute:

```
docker-compose up
```

This will start both the server and the client, making the application accessible at `http://localhost`.

## Contribution

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## References

- [Medium Article: WebRTC Fundamentals - Building a Video Calling Application](https://medium.com/stackademic/webrtc-fundamentals-building-a-video-calling-application-14023f818825)
- [WebRTC Documentation](https://webrtc.org/)
