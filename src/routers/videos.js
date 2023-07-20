import express from 'express';
import {
	handleComments,
	handleDelete,
	handleDeleteComments,
	handleEdit,
	handleWatch,
} from '../controllers/videos';

const videosRouter = express.Router();

videosRouter.get('/watch', handleWatch);

videosRouter.get('/edit', handleEdit);

videosRouter.get('/delete', handleDelete);

videosRouter.get('/comments', handleComments);

videosRouter.get('/comments/delete', handleDeleteComments);

export default videosRouter;
