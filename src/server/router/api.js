import express from 'express';
import { postVideoView } from '../controller/videos';

const apiRouter = express.Router();

const idParams = ':id([0-9a-f]{24})';

apiRouter.route(`/videos/${idParams}/view`).post(postVideoView);

export default apiRouter;
