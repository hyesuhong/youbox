import express from 'express';
import { handleEditUser } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.get('/edit', handleEditUser);

export default usersRouter;
