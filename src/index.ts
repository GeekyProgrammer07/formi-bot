import express, { Request, Response } from "express";
import { mainRouter } from "./routes/mainRouter";

const app = express();

app.use('/api/v1', mainRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
