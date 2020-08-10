import Discord = require('discord.js');
import dotenv = require('dotenv');
import fetch from 'node-fetch';

/* -----------------
   Startup
   ----------------
*/

// create a new Discord client
const client = new Discord.Client();
// able to get info from .env file
dotenv.config();
const botToken = process.env.DiscordBotToken;

// login to discord and display the bot as online and active
client.login(botToken);
console.log('Logging into bot');

// used to calculate uptime of the bot, start time of bot
let upTime: number; 

client.once('ready', () => {
    console.log('Bot initialized!');
    // get current time when bot comes online
    upTime = Date.now();
    // set status to bot of number of servers
    setStatus();
    console.log('Status initialized!');
    // update status every 5 min
    setInterval(setStatus, 300000);
});


/* -----------------
    Command Handling
   ----------------
*/

function setStatus() {
    const numOfServers = client.guilds.cache.size;

    client.user?.setPresence({
         activity: {
              name: `over ${numOfServers} ${(numOfServers === 1) ? "server" : "servers"}! | !help`, 
              type: 'WATCHING', 
            }, 
            status: 'online',
        })
        .catch(console.error);
}

/* -----------------
    Command Handling
   ----------------
*/

const prefix = "!"

// when bot sees a message from a user
client.on('message', message => {
    // checks if bot is mentioned 
    const mention = message.mentions.members?.first();
    const username = client.user?.username;

    // if the mention starts with a mention to the bot
    if (message.content.startsWith('<@') && mention?.user.username === client.user?.username && mention?.user.discriminator === client.user?.discriminator) {
        return message.channel.send(`Hey I'm ${username}! If you you're having trouble use the` + " ``!help`` command!");
    } 

    // if message doesn't start with the prefix or it's a bot then ignore message 
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    // parse arguments and the base command
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    // parse commands
    if (command === "ping") {
        if (mention) {
            message.delete();

            message.channel.send(`Pong. 🏓 <@${mention.id}> \n**Latency**: ${client.ws.ping}ms `)
            .then(function (message) {
                message.react("🏓")
                message.react("🅿")
                message.react("ℹ")
                message.react("🇳")
                message.react("🇬")
              });
              return;
        }

        message.channel.send(`Pong. 🏓 \n**Latency**: ${client.ws.ping}ms`)
        .then(function (message) {
            message.react("🏓")
          });
          return;

    } else if (command === "help") {
        return message.channel.send(helpEmbed);
    } else if (command === "beep") {

        message.channel.send("Boop!")
        .then(function (message) {
            message.react("🤖")
          });

          return

    } else if (command === "boop") {

         message.channel.send("Speed boost! Booooppp! \nhttps://media1.tenor.com/images/046793278bc20fd91df0647227dc00d4/tenor.gif?itemid=8971897")
        .then(function (message) {
            message.react("🤖")
          });

          return
    } else if (command === "uptime") {
        return message.channel.send(calcUpTime());
    } else if (command === "server") {
        message.channel.send(createServerEmbed(message));
    } else if (command === 'avatar') {
        const user = mention?.user || message.author;
        message.channel.send(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);    
    } else if (command === 'user') {
        message.channel.send(getUser(message));
    } else if (command === 'bruh' || command === 'meme') {
        fetchMeme().then(meme => {
            message.channel.send(meme.url);
        });

        return;
     } else if (command === 'invite') {
        message.channel.send(`**Invite **${client.user?.username} to your server!** \nhttps://discord.com/api/oauth2/authorize?client_id=738876776112980098&permissions=124992&scope=bot`);  
     } else if (command === "ow" || command === "overwatch") {
        // return if there isn't any arguments and give error message
        if (args.length < 3) {
            message.channel.send(`There were ${args.length} arguments given, 3 required. Please try again or use the` + '``!help`` command for more information!');
            return;
        }

        overwatchCommand(args).then(value => {
            return message.channel.send(value);
        });
    } 
});


/* ---------------------------------
   Functions & Objects for commands
   ---------------------------------
*/

// embed for the help command
const helpEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle(`Help! Prefix is "${prefix}"`)
	.setDescription('Learn about the commands!')
	.addFields(
        { name: 'ping', value: 'Pings' },
        { name: 'beep', value: 'Boops' },
        { name: 'boop', value: 'Beeps' },
        { name: 'uptime', value: 'Gets the uptime of the bot!' },
        { name: 'server', value: 'Gets information about the server!' },
        { name: 'avatar', value: "Sends the user's or mentioned user's avatar!" },
        { name: 'user', value: "Sends the user's or mentioned user's information!" },
        { name: 'bruh | meme', value: "Sends the user a meme from Reddit!" },
		{ name: 'overwatch | ow', value: 'Responds with Overwatch stats. \n \nUsage: ``ow <platform: pc, xbox, ps4, switch> <region: us, eu, asia> <battle tag>``'},
	)
    .setTimestamp()

// used to calculate uptime
function calcUpTime(): string {
    let timeNow = Date.now();
    let elapsedTime = (timeNow - upTime) / 1000; 
    // get days, hours, etc.
    let days = Math.floor(elapsedTime / 86400);
    elapsedTime %= 86400;
    let hours = Math.floor(elapsedTime / 3600);
    elapsedTime %= 3600;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);
    // return string 
    return `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`
}

// used in the server command
function createServerEmbed(message: any): Discord.MessageEmbed {
    const serverEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Information about ${message.guild?.name}`)
        .addFields(
            { name: 'Region', value: `${message.guild?.region}` },
            { name: 'Members', value: `${message.guild?.memberCount}` },
            { name: 'Created', value: `${message.guild?.createdAt}` },
        )
        .setTimestamp()

    const icon = message.guild.iconURL();
    if (icon) {
        serverEmbed.setThumbnail(icon);
    }

    return serverEmbed;
}

function getUser(message: any): Discord.MessageEmbed {
    const user = message.mentions.users.first() || message.author;
        let joinedTimestamp; // epoch time 
        let joinedDate; // human readable time
        let member;
        
        // check if user is member of the server
        if (user) {
            member = message.guild?.member(user);
        }
        // get their joined at date
        if (member) {
            joinedTimestamp = member.joinedAt;
        }
        // convert joined at date to human readable date
        if (joinedTimestamp) {
            joinedDate = new Date(joinedTimestamp);
        }

        const userEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle(user.username)
            .addFields(
                { name: 'Are you a robot? 🤖', value: `${user.bot ? "Yes" : "No"}` },
                { name: 'Creation', value: `${user.createdAt}` },
                { name: 'Joined date', value: joinedDate },
                { name: 'User ID', value: user.id  },
            )
            .setTimestamp()

        return userEmbed;
}

async function overwatchCommand(args: string[]) {
    // parse arguments so better usability
    if (args[0] === "xbox") {
        args[0] = "xbl"
    } else if (args[0] === "ps4") {
        args[0] = "psn"
    } else if (args[0] === "switch") {
        args[0] = "nintendo switch"
    } 
    // replace the common # with the dash required in the API
    if (args[2].includes('#')) {
        args[2] = args[2].replace('#', '-');
    }

    // fetch overwatch stats and then send a message with those stats
    let fetchAndParse = getOverwatchStats(args[0], args[1], args[2]).then(data => {
        const OverwatchEmbed = new Discord.MessageEmbed()
            .setColor('#f99e1a')
            .setTitle(`${data.username}'s Career Profile`)
            .setAuthor('Overwatch Stats', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Overwatch_circle_logo.svg/1024px-Overwatch_circle_logo.svg.png', `https://playoverwatch.com/en-us/career/${args[0]}/${args[2]}/`)
            .setThumbnail(data.portrait)
            .addFields(
                { name: 'Account Stats', value: `Level: ${data.level} \nEndorsement Level: ${data.endorsement.frame ? data.endorsement.frame.split('_')[1] : 0} \nSportmanship: ${data.endorsement.sportsmanship.rate}% \nShotcaller: ${data.endorsement.shotcaller.rate}% \nGood Teammate: ${data.endorsement.teammate.rate}%
                `},
            )
            .setTimestamp()

        if (!data.private) {
            // create embed message
            OverwatchEmbed.addField('Quickplay', `Playtime: ${data.playtime.quickplay}\nGames Played: ${data.games.quickplay.played} \nGames Won: ${data.games.quickplay.won}`, false);
            // if player has placed in the competitive season then displays stats
            if (data.games.competitive.played) {
                let competitveRatings = `Tank: ${data.competitive.tank.rank ? data.competitive.tank.rank : "Not ranked"} \nDamage: ${data.competitive.damage.rank ? data.competitive.damage.rank : "Not ranked"} \nSupport: ${data.competitive.support.rank  ? data.competitive.support.rank : "Not ranked"} \n \nPlaytime: ${data.playtime.competitive} \nGames Played: ${data.games.competitive.played ? data.games.competitive.played : 0 } \nGames Won: ${data.games.competitive.won ? data.games.competitive.won : 0 } \nGames Drawn: ${data.games.competitive.draw ? data.games.competitive.draw : 0 } \nGames Lost: ${data.games.competitive.lost ? data.games.competitive.lost : 0 } \n${data.games.competitive.win_rate ? `Games Win Rate: ${data.games.competitive.win_rate}` : ""}`

                OverwatchEmbed.addField('Competitive', competitveRatings, false);
            } else {
                OverwatchEmbed.addField('Competitive', 'This user has not placed in competitive this season.', false);
            }
        } else {
            OverwatchEmbed.setDescription("This user's profile is private.");
        }  

        return OverwatchEmbed;
    }).catch(err => {
        console.error(err);
        return `The user could not be found, please try again.`;
    });

    return fetchAndParse;
}

// function to fetch overwatch stats from the Overwatch API
async function getOverwatchStats(platform: string, region: string, battletag: string) {
    // fetch from Overwatch API 
    const OverwatchAPI = `http://owapi.io/profile/${platform}/${region}/${battletag}/`
    let response = await fetch(OverwatchAPI);
    let data = await response.json();
    return data;
}

// fetch from meme api 
async function fetchMeme() {
    const memeURL = 'https://meme-api.herokuapp.com/gimme';
    let response = await fetch(memeURL);
    let data = await response.json();
    return data;
}