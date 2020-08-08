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


const helpEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Help')
	.setDescription('Learn about the commands!')
	.addFields(
		{ name: '!ping', value: 'Pings' },
		{ name: '!overwatch or !ow', value: 'Responds with Overwatch stats. \n \nUsage: ``!ow <platform: pc, xbox, ps4, switch> <region: us, eu, asia> <battle tag>``'},
	)
	.setTimestamp()
// when bot sees a message from a user
client.on('message', message => {
    // if message doesn't start with the prefix or it's a bot then ignore message 
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;
    // parse arguments and the base command
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    // parse commands
    if (command === "ping") {
        message.channel.send('Pong.');
    } else if ((command === "ow" || command === "overwatch") && args.length !== 0) {
        // parse arguments so better usability
        if (args[0] === "xbox") {
            args[0] = "xbl"
        } else if (args[0] === "ps4") {
            args[0] = "psn"
        } else if (args[0] === "switch") {
            args[0] = "nintendo switch"
        } 

        if (args[2].includes('#')) {
            args[2] = args[2].replace('#', '-');
        }

        // fetch overwatch stats and then send a message with those stats
        getOverwatchStats(args[0], args[1], args[2]).then(data => {
            const OverwatchEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`${data.name.split('#')[0]}'s Career Profile`)
                .setAuthor('Overwatch Stats', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/1024px-Overwatch_circle_logo.svg.png', 'https://playoverwatch.com/en-us/career/pc/Sarako-11771/')
                .setThumbnail(data.icon)
                .addFields(
                    { name: 'Account Stats', value: `Level: ${data.prestige}${data.level} \nEndorsement: ${data.endorsement} \n` + (data.gamesWon !== 0 ? `Games won: ${data.gamesWon}` : "")},
                )
                .setTimestamp()

            if (!data.private) {
                // create embed message
                OverwatchEmbed.addField('Quickplay', `Games Played: ${data.quickPlayStats.games.played} \nGames Won: ${data.quickPlayStats.games.won}`, false);
                // if player has placed in the competitive season then displays stats
                if (data.ratings && data.rating !== 0) {
                    // capitalize all the roles in data
                    for (let i = 0; i < data.ratings.length; i++) {
                        let str = data.ratings[i].role;
                        data.ratings[i].role = str.charAt(0).toUpperCase() + str.slice(1);
                    }

                    let competitveRatings = `Overall SR: ${data.rating} \n ${data.ratings[0].role}: ${data.ratings[0].level} \n${data.ratings[1].role}: ${data.ratings[1].level} \n${data.ratings[2].role}: ${data.ratings[2].level} \n Games Played: ${data.competitiveStats.games.played} \n Games Won: ${data.competitiveStats.games.won}`

                    OverwatchEmbed.addField('Competitive', competitveRatings, false);
                } else {
                    OverwatchEmbed.addField('Competitive', 'This user has not placed in competitive this season.', false);
                }
            } else {
                OverwatchEmbed.setDescription("This user's profile is private.");
            }  

            message.channel.send(OverwatchEmbed);

        }).catch(err => {
            message.channel.send(`The user could not be found, please try again.`);
        });
    } else if (command === "help") {
        message.channel.send(helpEmbed);
    } else {
        message.channel.send('Invalid Command: Use the command ``!help`` for information on commands!');
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

