"use client";
import { io } from 'socket.io-client';

// Get base API URL without trailing '/api'
const getBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  // Remove '/api' if it exists at the end of the URL
  return apiUrl.endsWith('/api') 
    ? apiUrl.substring(0, apiUrl.length - 4) 
    : apiUrl;
};

// Initialize main socket connection
const mainSocket = io(getBaseUrl(), {
  path: '/socket.io',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  forceNew: true
});

// Initialize posts namespace connection
const postsSocket = io(`${getBaseUrl()}/posts`, {
  path: '/socket.io',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  forceNew: true
});

// Debug listeners for main socket
mainSocket.on('connect', () => {
  console.log('Main socket connected successfully with ID:', mainSocket.id);
});

mainSocket.on('connect_error', (error) => {
  console.error('Main socket connection error:', error.message);
});

// Debug listeners for posts socket
postsSocket.on('connect', () => {
  console.log('Posts socket connected successfully with ID:', postsSocket.id);
});

postsSocket.on('connect_error', (error) => {
  console.error('Posts socket connection error:', error.message);
});

// Export both sockets - you can choose to use either one based on your needs
export { mainSocket, postsSocket };
export default mainSocket; 