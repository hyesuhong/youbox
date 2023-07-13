import express from 'express';

const app = express();
const PORT = 8080;

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
