import express from 'express';
import { handleJoin, handleLogin } from '../controller/users';
import { getHome } from '../controller/videos';

const globalRouter = express.Router();

globalRouter.get('/', getHome);

globalRouter.get('/join', handleJoin);

globalRouter.get('/login', handleLogin);

export default globalRouter;
