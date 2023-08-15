import express from 'express';
import {
	finishGithubLogin,
	handleDelete,
	handleEdit,
	handleProfile,
	startGithubLogin,
} from '../controller/users';

const usersRouter = express.Router();

usersRouter.get('/edit', handleEdit);

usersRouter.get('/delete', handleDelete);

usersRouter.get('/github/start', startGithubLogin);

usersRouter.get('/github/finish', finishGithubLogin);

const idParams = ':id(\\d+)';

usersRouter.get(`/${idParams}`, handleProfile);

export default usersRouter;
