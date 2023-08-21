import express from 'express';
import {
	finishGithubLogin,
	getChangePassword,
	getEdit,
	handleDelete,
	handleProfile,
	postChangePassword,
	postEdit,
	startGithubLogin,
} from '../controller/users';
import {
	notSocialOnlyMiddleware,
	protectorMiddleware,
	publicOnlyMiddleware,
	uploadFilesMulter,
} from '../middleware/locals';

const usersRouter = express.Router();

usersRouter
	.route('/edit')
	.all(protectorMiddleware)
	.get(getEdit)
	.post(uploadFilesMulter.single('avatar'), postEdit);

usersRouter
	.route('/change-password')
	.all(protectorMiddleware, notSocialOnlyMiddleware)
	.get(getChangePassword)
	.post(postChangePassword);

usersRouter.get('/delete', handleDelete);

usersRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);

usersRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

const idParams = ':id(\\d+)';

usersRouter.get(`/${idParams}`, handleProfile);

export default usersRouter;
