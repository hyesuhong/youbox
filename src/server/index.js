import express from 'express';
import morgan from 'morgan';
import global from './routers/global';
import users from './routers/users';
import videos from './routers/videos';

const app = express();
const PORT = 8080;

app.use(morgan('dev'));

/* use routers */
app.use('/', global);
app.use('/users', users);
app.use('/videos', videos);

/* start server console */
const handleListening = () => console.log('server listening on port 8080');
app.listen(PORT, handleListening);

// console.log(app);
