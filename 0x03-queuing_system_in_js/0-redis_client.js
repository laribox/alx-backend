import { createClient } from 'redis';

// Create Redis client
const client = createClient();

// Event: successful connection
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Event: connection error
client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err.message}`);
});

