import express from 'express';
import { fileRouter } from './fileRouter';
import { queryRouter } from './queryRouter';
import { conversationRouter } from './conversationRouter';

export const mainRouter = express.Router();

mainRouter.use('/files', fileRouter);
mainRouter.use('/retrieve', queryRouter);
mainRouter.use('/conversation', conversationRouter);