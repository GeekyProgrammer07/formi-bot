import express from 'express';
import Redis from "ioredis";

const app = express();


const redis = new Redis(); 

redis.set("Name", "Suman");
redis.get("Name", (err, result) => {
  console.log(result);
});


app.get('/',  (req, res) => {
    res.send("Hi there");
})

app.listen(3000, () => {
    console.log("Listening on 3000")
})