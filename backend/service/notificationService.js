import redis from 'redis';
const subscriber = redis.createClient();

subscriber.connect().then(() => {
  subscriber.subscribe('task-events', (message) => {
    const data = JSON.parse(message);
  });
});
