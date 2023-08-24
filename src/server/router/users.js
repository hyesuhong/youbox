import express from 'express';
import {
	finishGithubLogin,
	getChangePassword,
	getEdit,
	handleDelete,
	getProfile,
	postChangePassword,
	postEdit,
	postUploadAvatar,
	startGithubLogin,
} from '../controller/users';
import {
	notSocialOnlyMiddleware,
	protectorMiddleware,
	publicOnlyMiddleware,
	uploadAvatars,
} from '../middleware/locals';

const usersRouter = express.Router();

usersRouter
	.route('/edit')
	.all(protectorMiddleware)
	.get(getEdit)
	.post(postUploadAvatar, postEdit);

usersRouter
	.route('/change-password')
	.all(protectorMiddleware, notSocialOnlyMiddleware)
	.get(getChangePassword)
	.post(postChangePassword);

usersRouter.get('/delete', handleDelete);

usersRouter.get('/github/start', publicOnlyMiddleware, startGithubLogin);

usersRouter.get('/github/finish', publicOnlyMiddleware, finishGithubLogin);

const idParams = ':id([0-9a-f]{24})';

usersRouter.get(`/${idParams}`, getProfile);

export default usersRouter;
