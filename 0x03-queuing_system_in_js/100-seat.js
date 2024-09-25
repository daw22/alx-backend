import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import express from 'express';

const client = createClient();
const queue = createQueue();
let reservationEnabled = false;

function reserveSeat(number) {
  client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const getAsync = promisify(client.get).bind(client);
  const seats = await getAsync('available_seats');
  return seats;
}

const app = express();

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    res.json({ status: 'Reservation are blocked' });
    return;
  }
  const job = queue.create('reserve_seat');
  job.save((err) => {
    if (!err) {
      res.json({ status: 'Reservation in progress' });
    } else {
      res.json({ status: 'Reservation failed' });
    }
  });
  job.on('complete', (result) => { /* eslint-disable-line no-unused-vars */
    console.log(`Seat reservation job ${job.id} completed`);
  });
  job.on('failed', (errMsg) => {
    console.log(`Seat reservation job ${job.id} failed: ${errMsg}`);
  });
});

app.get('/process', (req, res) => {
  res.json({ status: 'Queue processing' });
  queue.process('reserve_seat', async (job, done) => {
    const seats = await getCurrentAvailableSeats();
    reserveSeat(seats - 1);
    const newNumberOfAvailableSeats = await getCurrentAvailableSeats();
    if (newNumberOfAvailableSeats === 0) reservationEnabled = false;
    if (newNumberOfAvailableSeats >= 0) {
      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

app.listen(1245, () => {
  reserveSeat(50);
  reservationEnabled = true;
});
