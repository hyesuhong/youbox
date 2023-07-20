import express from 'express';
import {
	handleComments,
	handleDelete,
	handleDeleteComments,
	handleEdit,
	handleUpload,
	handleWatch,
} from '../controllers/videos';

const videosRouter = express.Router();

// videosRouter.get('/comments', handleComments);

// videosRouter.get('/comments/delete', handleDeleteComments);

const idParams = ':id(\\d+)';

videosRouter.get(`/${idParams}`, handleWatch);

videosRouter.get(`/${idParams}/edit`, handleEdit);

videosRouter.get(`/${idParams}/delete`, handleDelete);

videosRouter.get('/upload', handleUpload);

export default videosRouter;
