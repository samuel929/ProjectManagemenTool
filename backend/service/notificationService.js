import redis from 'redis';
const subscriber = redis.createClient();

subscriber.connect().then(() => {
  console.log('Notification service subscribed to Redis');
  subscriber.subscribe('task-events', (message) => {
    const data = JSON.parse(message);
    console.log(`📣 Notify User ${data.userId}: ${data.message}`);
  });
});
