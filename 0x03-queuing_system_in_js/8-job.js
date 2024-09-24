function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }
  jobs.forEach((job) => {
    const newJob = queue.create('push_notification_code_3', job);
    newJob.save((err) => {
      if (!err) console.log(`Notification job created: ${newJob.id}`);
    });
    newJob.on('complete', (result) => { /* eslint-disable-line no-unused-vars */
      console.log(`Notification job ${newJob.id} completed`);
    });
    newJob.on('failed', (err) => {
      console.log(`Notification job ${newJob.id} failed: ${err.message}`);
    });
    newJob.on('progress', (progress, data) => { /* eslint-disable-line no-unused-vars */
      console.log(`Notification job ${newJob.id} ${progress}% complete`);
    });
  });
}

module.exports = createPushNotificationsJobs;
