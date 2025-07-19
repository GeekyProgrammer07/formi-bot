import express from 'express';
import { fileRouter } from './fileRouter';
import { queryRouter } from './queryRouter';

export const mainRouter = express.Router();

mainRouter.get('/', (_, res) => {
    res.send("Hi there");
});
mainRouter.use('/files', fileRouter);
mainRouter.use('/query', queryRouter);
