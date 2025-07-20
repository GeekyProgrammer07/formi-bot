import express from "express";
import { convertToJson } from "../controller/fileController";

export const fileRouter = express.Router();

fileRouter.get('/convert', convertToJson)