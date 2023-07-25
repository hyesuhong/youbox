import express from 'express';
import {
	handleDelete,
	getEdit,
	handleUpload,
	handleWatch,
	postEdit,
} from '../controller/videos';

const videosRouter = express.Router();

const idParams = ':id(\\d+)';

/* GET: watch one video */
videosRouter.get(`/${idParams}`, handleWatch);

/* GET & POST: edit one video */
videosRouter.route(`/${idParams}/edit`).get(getEdit).post(postEdit);

/* GET: delete one video */
videosRouter.get(`/${idParams}/delete`, handleDelete);

videosRouter.get('/upload', handleUpload);

export default videosRouter;
