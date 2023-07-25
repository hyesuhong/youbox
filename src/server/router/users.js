import express from 'express';
import {
	handleDelete,
	handleEdit,
	handleLogout,
	handleProfile,
} from '../controller/users';

const usersRouter = express.Router();

usersRouter.get('/logout', handleLogout);

usersRouter.get('/edit', handleEdit);

usersRouter.get('/delete', handleDelete);

const idParams = ':id(\\d+)';

usersRouter.get(`/${idParams}`, handleProfile);

export default usersRouter;
