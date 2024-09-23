import { createClient } from 'redis';

const client = createClient();

client.on('error', (err) => {
  console.log('Redis client not connected to the server:', err.message);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

const channelName = 'holberton school channel';
client.subscribe(channelName);

client.on('message', (channel, message) => {
  if (channel === channelName) {
    if (message === 'KILL_SERVER') {
      client.unsubscribe(channelName);
      process.exit(0);
    }
    console.log(message);
  }
});
