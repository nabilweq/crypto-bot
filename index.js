const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
// const { Telegraf }  = require('telegraf');

// const bot = new Telegraf(process.env.BOT_TOKEN);

app.get('/', async (req, res) => {
    res.send("Hello, Iam here");
});

app.listen(process.env.PORT, ()=> {
    console.log("server started");
});