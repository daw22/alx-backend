import createPushNotificationsJobs from './8-job';
import { createQueue } from 'kue';
import { expect } from 'chai';
import sinon from 'sinon';

const queue = createQueue();
const jobs = [
  {
    phoneNumber: '4159518782',
    message: 'This is the code 4321 to verify your account'
  },
  {
    phoneNumber: '4158718781',
    message: 'This is the code 4562 to verify your account'
  },
];

describe('test createPushNotificationJobs', function() {
  before(() => queue.testMode.enter());
  beforeEach(() => sinon.spy(console, 'log'));
  after(() => queue.testMode.exit());
  afterEach(() => {
    sinon.restore();
    queue.testMode.clear();
  });

  it('test the creation of jobs', () => {
    createPushNotificationsJobs(jobs, queue);
    expect(queue.testMode.jobs.length).to.equal(2);
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3');
    expect(queue.testMode.jobs[0].data).to.eql(jobs[0]);
    expect(console.log.calledWith(`Notification job created: ${queue.testMode.jobs[0].id}`)).to.be.true;
  });

  it('display a error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs(1, queue)).to.throw();
    expect(() => createPushNotificationsJobs(1, queue)).to.throw(/Jobs is not an array/);
  });

  it('throws if queue is not a valid kue', function() {
    expect(() => createPushNotificationsJobs(jobs, "")).to.throw();
  });

  it('test job progress event report', (done) => {
    createPushNotificationsJobs(jobs, queue);
    queue.testMode.jobs[0].addListener('progress', () => {
      const id = queue.testMode.jobs[0].id;
      expect(console.log.calledWith(`Notification job ${id} 50% complete`)).to.be.true;
      done();
    });
    queue.testMode.jobs[0].emit('progress', 50, 100);
  });

  it('test job failed event report', (done) => {
    createPushNotificationsJobs(jobs, queue);
    queue.testMode.jobs[0].addListener('failed', () => {
      const id = queue.testMode.jobs[0].id;
      expect(console.log.calledWith(`Notification job ${id} failed: job failed!`)).to.be.true;
      done();
    });
    queue.testMode.jobs[0].emit('failed', new Error('job failed!'));
  });

  it('test job completed event report', (done) => {
    createPushNotificationsJobs(jobs, queue);
    queue.testMode.jobs[0].addListener('complete', () => {
      const id = queue.testMode.jobs[0].id;
      expect(console.log.calledWith(`Notification job ${id} completed`)).to.be.true;
      done();
    });
    queue.testMode.jobs[0].emit('complete', true);
  });
});
