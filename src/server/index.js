import 'dotenv/config';
import app from './server';

const PORT = 8080;

/* start server console */
const handleListening = () =>
	console.log(`✅ Server listening on http://localhost:${PORT}/`);
app.listen(PORT, handleListening);
