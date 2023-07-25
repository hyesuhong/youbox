import express from 'express';
import {
	getEdit,
	handleWatch,
	postEdit,
	getUpload,
	postUpload,
} from '../controller/videos';

const videosRouter = express.Router();

const idParams = ':id(\\d+)';

/* GET: watch one video */
videosRouter.get(`/${idParams}`, handleWatch);

/* GET & POST: edit one video */
videosRouter
	.route(`/${idParams}/edit`) //
	.get(getEdit) //
	.post(postEdit);

/* GET & POST: upload a video */
videosRouter
	.route('/upload') //
	.get(getUpload) //
	.post(postUpload);

export default videosRouter;
