import { createClient } from 'redis';
import { promisify } from 'util';

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

// Promisified get function
const getAsync = promisify(client.get).bind(client);

// Function to set a value in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, (err, reply) => {
    if (err) throw err;
    console.log(reply);
  });
}

// Async function to get a value from Redis
async function displaySchoolValue(schoolName) {
  try {
    const reply = await getAsync(schoolName);
    console.log(reply);
  } catch (err) {
    console.error(err);
  }
}

// Example calls
(async () => {
  await displaySchoolValue('Holberton');
  setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
})();

