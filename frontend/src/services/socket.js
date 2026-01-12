import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

let socket = null;

export const initializeSocket = (userId, dispatch) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io('http://localhost:5000', {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    // Register user with socket
    socket.emit('register', userId);
  });

  // Listen for hire notifications
  socket.on('hired', (data) => {
    toast.success(data.message, {
      duration: 5000,
      icon: '🎉',
    });
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
