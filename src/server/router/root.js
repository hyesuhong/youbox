import express from 'express';
import { getJoin, getLogin, postJoin, postLogin } from '../controller/users';
import { getHome, getSearch } from '../controller/videos';

const rootRouter = express.Router();

rootRouter.get('/', getHome);

/* GET & POST: join */
rootRouter.route('/join').get(getJoin).post(postJoin);

rootRouter.route('/login').get(getLogin).post(postLogin);

rootRouter.get('/search', getSearch);

export default rootRouter;
