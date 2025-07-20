import { Router } from "express"
import { conversationLogs } from "../controller/conversationLogs";

export const conversationRouter = Router()

conversationRouter.post('/logs', conversationLogs);