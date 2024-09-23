import { createQueue } from 'kue';

const queue = createQueue();

const data = {
  phoneNumber: '',
  message: '',
};

const job = queue.create('push_notification_code', data);

job.save((err) => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', (result) => /* eslint-disable-line no-unused-vars */{
  console.log('Notification job completed');
});

job.on('failed', (errorMessage) => /* eslint-disable-line no-unused-vars */{
  console.log('Notification job failed');
});
