// Import Redis
const redis = require('redis');

// Create a Redis client
const client = redis.createClient();

// Handle connection events
client.on('connect', function () {
  console.log('Connected to Redis...');
});

client.on('error', function (err) {
  console.log('Redis error: ' + err);
});

// Example operations: Set and Get key-value
client.set('name', 'John Doe', function (err, reply) {
  if (err) throw err;
  console.log('SET:', reply);
  
  // Retrieve the value for the key 'name'
  client.get('name', function (err, reply) {
    if (err) throw err;
    console.log('GET:', reply);

    // Close the connection
    client.quit();
  });
});