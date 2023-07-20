import express from 'express';
import { handleWatchVideo } from '../controllers/videos';

const videosRouter = express.Router();

videosRouter.get('/watch', handleWatchVideo);

export default videosRouter;
