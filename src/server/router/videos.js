import express from 'express';
import {
	getEdit,
	getWatch,
	postEdit,
	getUpload,
	postUpload,
	deleteVideo,
} from '../controller/videos';

const videosRouter = express.Router();

// const idParams = ':id(\\d+)';

/* mongoose's ObjectId = 24 hexadecimal character string  */
const idParams = ':id([0-9a-f]{24})';

/* GET: watch one video */
videosRouter.get(`/${idParams}`, getWatch);

/* GET & POST: edit one video */
videosRouter
	.route(`/${idParams}/edit`) //
	.get(getEdit) //
	.post(postEdit);

/* GET: delete a video */
videosRouter
	.route(`/${idParams}/delete`) //
	.get(deleteVideo);

/* GET & POST: upload a video */
videosRouter
	.route('/upload') //
	.get(getUpload) //
	.post(postUpload);

export default videosRouter;