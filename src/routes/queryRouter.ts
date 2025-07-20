import express from "express";
import { retrieveController } from "../controller/retrieveController";

export const queryRouter = express.Router();

queryRouter.get('/', retrieveController)