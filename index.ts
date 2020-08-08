import Discord = require('discord.js');
import dotenv = require('dotenv');
import fetch from 'node-fetch';
// create a new Discord client
const client = new Discord.Client();
// able to get info from .env file
dotenv.config();
const botToken = process.env.DiscordBotToken;

// login to discord and display the bot as online and active
client.login(botToken);

client.once('ready', () => {
	console.log('Bot initialized!');
});

// take commands and messaging
const prefix = "!"
// when bot sees a message from a user
client.on('message', message => {
    // if message doesn't start with the prefix or it's a bot then ignore message 
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;
    // parse arguments and the base command
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();
    
    if (command === "ping") {
        message.channel.send('Pong.');
    } else {
        getOverwatchStats("pc", "us", "Sarako-11771").then(data => {
            console.log(data);
            message.channel.send(`Wow your account ${data.name} is level ${data.prestige}${data.level}`);
        });
    }
});

// function to fetch overwatch stats from the Overwatch API
async function getOverwatchStats(platform: string, region: string, battletag: string, complete = false, heroes ? : string[]) {
    // determine API endpoint based off arguments inputted by the user
    let apiEndPoint; 
    if (heroes) {
        apiEndPoint = "heroes"
    } else {
        complete ? apiEndPoint = "complete" : apiEndPoint = "profile"
    }
    // fetch from Overwatch API 
    const OverwatchAPI = `https://ow-api.com/v1/stats/${platform}/${region}/${battletag}/${apiEndPoint}`
    let response = await fetch(OverwatchAPI);
    let data = await response.json()
    return data;
}

