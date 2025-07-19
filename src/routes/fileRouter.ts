import express from "express";
import { convertToJson } from "../controller/fileRouterController";

export const fileRouter = express.Router();

fileRouter.get('/convert', convertToJson)