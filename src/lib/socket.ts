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

// Initialize socket with proper configuration
const socket = io(getBaseUrl(), {
  path: '/socket.io',
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
  autoConnect: true,
  forceNew: true
});

// Debug listeners
socket.on('connect', () => {
  console.log('Socket connected successfully with ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});

export default socket;