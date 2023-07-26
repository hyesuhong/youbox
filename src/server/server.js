import express from 'express';
import morgan from 'morgan';
import './db/database';
import './model/videos';
import global from './router/global';
import users from './router/users';
import videos from './router/videos';

const app = express();

app.use(morgan('dev'));

/* setting html template engine & views directory */
app.set('view engine', 'pug');
app.set('views', `${process.cwd()}/src/client/views`);

/* express understand form values */
app.use(express.urlencoded({ extended: true }));

/* use routers */
app.use('/', global);
app.use('/users', users);
app.use('/videos', videos);

export default app;