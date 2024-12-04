import { createClient, print } from 'redis';

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

// Create hash in Redis
client.hset('HolbertonSchools', 'Portland', 50, print);
client.hset('HolbertonSchools', 'Seattle', 80, print);
client.hset('HolbertonSchools', 'New York', 20, print);
client.hset('HolbertonSchools', 'Bogota', 20, print);
client.hset('HolbertonSchools', 'Cali', 40, print);
client.hset('HolbertonSchools', 'Paris', 2, print);

// Retrieve and display the hash
client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) throw err;
  console.log(reply);
});

