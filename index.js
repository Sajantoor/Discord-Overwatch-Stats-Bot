const Discord = require('discord.js');
const dotenv = require('dotenv');

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

// when bot sees a message from a user
client.on('message', message => {
	if (message.content === `!ping`) {
        message.channel.send('Pong.');
    } else if (message.content === `!beep`) {
        message.channel.send('Boop.');
    }
});
