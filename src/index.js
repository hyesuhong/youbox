import express from 'express';
import morgan from 'morgan';

const app = express();
const PORT = 8080;

app.use(morgan('dev'));

/* global router */
const globalRouter = express.Router();
const handleHome = (req, res) => res.send('Home');

globalRouter.get('/', handleHome);

/* users router */
const usersRouter = express.Router();
const handleEditUser = (req, res) => res.send('Edit User');

usersRouter.get('/edit', handleEditUser);

/* video router */
const videosRouter = express.Router();
const handleWatchVideo = (req, res) => res.send('Watch Video');

videosRouter.get('/watch', handleWatchVideo);

/* use routers */
app.use('/', globalRouter);
app.use('/users', usersRouter);
app.use('/videos', videosRouter);

/* start server console */
const handleListening = () => console.log('server listening on port 8080');
app.listen(PORT, handleListening);

// console.log(app);
