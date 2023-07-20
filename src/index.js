import express from 'express';
import morgan from 'morgan';

const app = express();
const PORT = 8080;

/* const logger = (req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
};

// const privateMiddleware = (req, res, next) => {
// 	const { url } = req;
// 	if (url === '/protected') {
// 		return res.send('<h1>Not allowed</h1>');
// 	}
// 	next();
// };

app.use(logger);
// app.use(privateMiddleware); */

app.use(morgan('dev'));

app.get('/', (req, res) => {
	// return res.end();
	return res.send('Home');
});

app.get('/login', (req, res) => {
	return res.send('Login');
});

const handleListening = () => console.log('server listening on port 8080');

app.listen(PORT, handleListening);

// console.log(app);
