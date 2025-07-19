import express from 'express';
import { mainRouter } from './routes/mainRouter';

const app = express();

app.use('/api/v1', mainRouter);

app.get('/', (_, res) => {
    res.send("Hi there");
});

app.listen(3000, () => {
    console.log(`Server is Up`);
});
