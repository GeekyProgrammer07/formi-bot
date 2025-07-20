import express from "express";
import { mainRouter } from "./routes/mainRouter";

const app = express();

app.use(express.json());

app.use('/api/v1', mainRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
