import express from 'express';
import { handleDelete, handleEdit } from '../controllers/users';

const usersRouter = express.Router();

usersRouter.get('/edit', handleEdit);

usersRouter.get('/delete', handleDelete);

export default usersRouter;
