require("dotenv").config();
const express = require('express');

const app = express();
const { Telegraf }  = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

const apiKey = process.env.API_KEY;

bot.command('start', ctx => {
    sendStartMessage(ctx)
});

bot.action('start', ctx => {
    ctx.deleteMessage();
    sendStartMessage(ctx)
});

function sendStartMessage(ctx) {
    let startMessage = "Welcome, this bot gives you crypto currency information";
    bot.telegram.sendMessage(ctx.chat.id, startMessage,
    {
        reply_markup: {
            inline_keyboard: [
                [
                    {text: "Crypto Prices", callback_data: "price"}
                ],
                [
                    {text: "CoinMarketcap", url: "https://www.cryptocompare.com/"}
                ]
            ]

        }
    });
}

bot.action('price', ctx => {
    let priceMessage = "Get Price Information. Select one of the cryptocurrencies below";
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id, priceMessage,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: "BTC", callback_data: "price-BTC"},
                        {text: "ETH", callback_data: "price-ETH"},
                    ],
                    [
                        {text: "BCH", callback_data: "price-BCH"},
                        {text: "LTC", callback_data: "price-LTC"},
                    ],
                    [
                        {text: "Back to Menu", callback_data: "start"}
                    ]
                ]
            }
        });
});

let priceActionList = ["price-BTC", "price-ETH", "price-BCH", "price-LTC"];
bot.action(priceActionList, async ctx => {

    let symbol = ctx.match.input.split('-')[1];

    try {

        let res = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey} `)

        let data = res.data.DISPLAY[symbol].USD;

        let message = 
        `
Symbol:  ${symbol}
Price:  ${data.PRICE}
Open:  ${data.OPENDAY}
High:  ${data.HIGHDAY}
Low:  ${data.LOWDAY}
Supply:  ${data.SUPPLY}
Market Cap:  ${data.MKTCAP}
`;

        ctx.deleteMessage();
        bot.telegram.sendMessage(ctx.chat.id, message, 
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {text: "Back to Prices", callback_data: "price"}
                    ]
                ]
    
            }
        });

    } catch (err) {
        ctx.reply("Error Encountered");
        console.log(err.message);
    }
    //https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=IND
});

bot.command('info', ctx => {
    bot.telegram.sendMessage(ctx.chat.id, "Bot Info", 
    {
        reply_markup: {
            keyboard: [
                [
                    {text: "Credits"},
                    {text: "API"}
                ]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.hears('Credits', ctx => {
    ctx.reply("This bot was made by Nabeel");
});

bot.hears('API', ctx => {
    ctx.reply("This bot uses cryptocompare API");
});

bot.launch();

app.listen(3000, ()=> {
    console.log("server started");
})