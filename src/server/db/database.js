import mongoose from 'mongoose';

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

/* add ERROR event */
db.on('error', (error) => console.log('⛔️ DB Error', error));

/* add OPEN event once */
db.once('open', () => console.log('✅ Connected to DB'));
