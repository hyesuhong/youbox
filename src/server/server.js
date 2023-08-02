import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import { localsMiddleware } from './middleware/locals';
import './db/database';
import './model/videos';
import './model/users';
import root from './router/root';
import users from './router/users';
import videos from './router/videos';

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
		secret: 'Hello!',
		resave: true,
		saveUninitialized: true,
	})
);

app.use(localsMiddleware);

/* use routers */
app.use('/', root);
app.use('/users', users);
app.use('/videos', videos);

export default app;
