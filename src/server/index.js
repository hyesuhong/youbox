import express from 'express';
import morgan from 'morgan';
import global from './router/global';
import users from './router/users';
import videos from './router/videos';

const app = express();
const PORT = 8080;

app.use(morgan('dev'));

/* setting html template engine & views directory */
app.set('view engine', 'pug');
app.set('views', `${process.cwd()}/src/client/views`);

/* use routers */
app.use('/', global);
app.use('/users', users);
app.use('/videos', videos);

/* start server console */
const handleListening = () => console.log('server listening on port 8080');
app.listen(PORT, handleListening);
