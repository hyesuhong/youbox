import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/youbox');

const db = mongoose.connection;

/* add ERROR event */
db.on('error', (error) => console.log('⛔️ DB Error', error));

/* add OPEN event once */
db.once('open', () => console.log('✅ Connected to DB'));
