import { Server } from 'socket.io';
import DBConnect from '../../../DBConnect';

// Initialize the WebSocket server outside the handler function
let io;

export default async function handler(req, res) {
  if (!io) {
    // Initialize the WebSocket server only once
    io = new Server(res.socket.server, {
      path: '/api/hello',
    });

    const onlineUsers = new Map();

    io.on('connection', (socket) => {
      socket.on('add-user', (user) => {
        onlineUsers.set(user.id, socket.id);
      });

      socket.on('input-change', (msg) => {
        const socketUser = onlineUsers.get(msg.to);
        if (socketUser) {
          socket.to(socketUser).emit('receive', msg);
        }
      });

      socket.on('disconnect', () => {
        // Remove user from the Map when disconnected
        for (const [key, value] of onlineUsers.entries()) {
          if (value === socket.id) {
            onlineUsers.delete(key);
            break;
          }
        }
      });
    });
  }

  res.end(); // Avoid ending the response immediately
}
