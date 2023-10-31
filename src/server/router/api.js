import express from 'express';
import {
	deleteVideoComment,
	postVideoComment,
	postVideoView,
} from '../controller/videos';

const apiRouter = express.Router();

const idParams = ':id([0-9a-f]{24})';

apiRouter.route(`/videos/${idParams}/view`).post(postVideoView);

apiRouter.route(`/videos/${idParams}/comment`).post(postVideoComment);

apiRouter.route(`/comments/${idParams}`).delete(deleteVideoComment);

export default apiRouter;
