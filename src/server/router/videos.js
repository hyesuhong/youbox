import express from 'express';
import {
	getEdit,
	getWatch,
	postEdit,
	getUpload,
	postUpload,
	deleteVideo,
} from '../controller/videos';
import { protectorMiddleware } from '../middleware/locals';

const videosRouter = express.Router();

/* mongoose's ObjectId = 24 hexadecimal character string  */
const idParams = ':id([0-9a-f]{24})';

/* GET: watch one video */
videosRouter.get(`/${idParams}`, getWatch);

/* GET & POST: edit one video */
videosRouter
	.route(`/${idParams}/edit`) //
	.all(protectorMiddleware)
	.get(getEdit) //
	.post(postEdit);

/* GET: delete a video */
videosRouter
	.route(`/${idParams}/delete`) //
	.all(protectorMiddleware)
	.get(deleteVideo);

/* GET & POST: upload a video */
videosRouter
	.route('/upload') //
	.all(protectorMiddleware)
	.get(getUpload) //
	.post(postUpload);

export default videosRouter;
