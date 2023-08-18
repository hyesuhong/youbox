import express from 'express';
import {
	getJoin,
	getLogin,
	getLogout,
	postJoin,
	postLogin,
} from '../controller/users';
import { getHome, getSearch } from '../controller/videos';
import {
	protectorMiddleware,
	publicOnlyMiddleware,
} from '../middleware/locals';

const rootRouter = express.Router();

rootRouter.get('/', getHome);

/* GET & POST: join */
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);

rootRouter
	.route('/login')
	.all(publicOnlyMiddleware)
	.get(getLogin)
	.post(postLogin);

rootRouter.get('/logout', protectorMiddleware, getLogout);

rootRouter.get('/search', getSearch);

export default rootRouter;
