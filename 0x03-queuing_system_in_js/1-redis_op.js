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

// Function to set a value in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, print);
}

// Function to get a value from Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) throw err;
    console.log(reply);
  });
}

// Example calls
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');

