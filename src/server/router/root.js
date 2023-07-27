import express from 'express';
import { getJoin, handleLogin, postJoin } from '../controller/users';
import { getHome, getSearch } from '../controller/videos';

const rootRouter = express.Router();

rootRouter.get('/', getHome);

/* GET & POST: join */
rootRouter.route('/join').get(getJoin).post(postJoin);

rootRouter.get('/login', handleLogin);

rootRouter.get('/search', getSearch);

export default rootRouter;
