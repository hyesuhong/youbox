import express from 'express';
import {
	finishGithubLogin,
	getEdit,
	handleDelete,
	handleProfile,
	postEdit,
	startGithubLogin,
} from '../controller/users';
import {
	protectorMiddleware,
	publicOnlyMiddleware,
} from '../middleware/locals';

const usersRouter = express.Router();

usersRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);

usersRouter.get('/delete', handleDelete);

usersRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);

usersRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

const idParams = ':id(\\d+)';

usersRouter.get(`/${idParams}`, handleProfile);

export default usersRouter;
