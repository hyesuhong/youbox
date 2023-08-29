import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { localsMiddleware } from './middleware/locals';
import './db/database';
import './model/videos';
import './model/users';
import root from './router/root';
import users from './router/users';
import videos from './router/videos';
import apiRouter from './router/api';

const app = express();

app.use(morgan('dev'));

/* setting html template engine & views directory */
app.set('view engine', 'pug');
app.set('views', `${process.cwd()}/src/client/views`);

/* express understand form values */
app.use(express.urlencoded({ extended: true }));

/* use session middleware */
app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
	})
);

app.use(localsMiddleware);

app.use('/uploads', express.static('uploads'));

app.use('/static', express.static('assets'));

/* use routers */
app.use('/', root);
app.use('/users', users);
app.use('/videos', videos);
app.use('/api', apiRouter);

export default app;
