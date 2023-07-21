import express from 'express';
import { handleJoin, handleLogin } from '../controllers/users';
import { handleHome, handleSearch } from '../controllers/videos';

const globalRouter = express.Router();

globalRouter.get('/', handleHome);

globalRouter.get('/join', handleJoin);

globalRouter.get('/login', handleLogin);

globalRouter.get('/search', handleSearch);

export default globalRouter;
