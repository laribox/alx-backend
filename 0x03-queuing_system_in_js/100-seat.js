import express from 'express';
import { createClient } from 'redis';
import kue from 'kue';
import { promisify } from 'util';

const app = express();
const port = 1245;

const client = createClient();
const queue = kue.createQueue();
const getAsync = promisify(client.get).bind(client);

let reservationEnabled = true;

const reserveSeat = (number) => client.set('available_seats', number);
const getCurrentAvailableSeats = async () => (await getAsync('available_seats')) || 0;

app.get('/available_seats', async (req, res) => {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat');

  job
    .on('complete', () => console.log(`Seat reservation job ${job.id} completed`))
    .on('failed', (errorMessage) => console.log(`Seat reservation job ${job.id} failed: ${errorMessage}`));

  job.save((err) => {
    if (!err) res.json({ status: 'Reservation in process' });
    else res.json({ status: 'Reservation failed' });
  });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats <= 0) {
      reservationEnabled = false;
      return done(new Error('Not enough seats available'));
    }

    reserveSeat(availableSeats - 1);
    done();
  });
});

reserveSeat(50);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

