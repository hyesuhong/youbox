import express from 'express';
import { handleHome } from '../controllers/global';

const globalRouter = express.Router();

globalRouter.get('/', handleHome);

export default globalRouter;
