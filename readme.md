# Shitty Robot Idea: The Discord Bot
<p align="center">
  <img src="../assets/hello.png" alt="Screenshot of Hello Message"/>
</p>

> Learning how to develop a discord bot using Node.js and TypeScript!


#### Table of Contents
 * [About](#About)
 * [Technologies](#Technologies)
 * [How It Works](#How-It-Works)
 * [Getting Started](#Getting-Started)
 * [Contributions](#Contributions)
 
 ## About
> This Discord Bot has many features from being able to get user and server information, to get Overwatch stats or fun things like posting random memes and beeping like a robot 🤖. The purpose of this project was to learn more about Node.js, TypeScript and the process behind creating a chat bot like a Discord bot. This was the first time I've used Node.js and TypeScript in a project and it was a fun learning experience! 

![Screenshot of the Help Message](../assets/help.png)

[Add this bot to your server!](https://discord.com/api/oauth2/authorize?client_id=738876776112980098&permissions=124992&scope=bot)  

## Technologies
### TypeScript
> [TypeScript](https://www.typescriptlang.org/) is a strong typed JavaScript like programming language that complies to JavaScript. This was the first time I've used TypeScript before.  

### Node.js
> [Node.js](https://nodejs.org/en/) served as the backend to run the Discord bot. 

### Discord.js
> [Discord.js](https://github.com/discordjs/discord.js) was an open source library that allowed for easy use of the [Discord API](https://discord.com/developers/docs/intro) within a JavaScript environment. 

### Google Cloud
> [Google Cloud](https://cloud.google.com/nodejs) is the solution chosen to run the Node.js file in the cloud instead of locally. 

### Overwatch API 
> The [Overwatch API](https://github.com/alfg/overwatch-api) was used to fetch the user's or another users stats in the game Overwatch! This allowed users to look up this information within Discord without the need to have to go the Overwatch website. Example usage: `!ow pc us super#7181`

### Memes API
> The [Memes API](https://github.com/R3l3ntl3ss/Meme_Api) grabs memes from Reddit and the bot sends them when the user uses the `!memes` command!

## How It Works
> The bot works by connecting to the Discord API using Discord.js and the technologies mentioned above. 
```ts
// create a new Discord client
const client = new Discord.Client();
const botToken = process.env.DiscordBotToken;

// login to discord and display the bot as online and active
client.login(botToken);
console.log('Logging into bot');

client.once('ready', () => {
    console.log('Bot initialized!');
    // set status to bot of number of servers
    setStatus();
    console.log('Status initialized!');
});
```
> This part of the code attempts to connect to the Discord API, once a connection is established the bot is 'online'. 

```ts
client.on('message', message => {
    // if message doesn't start with the prefix or it's a bot then ignore message 
    if (!message.content.startsWith(prefix) || message.author.bot) 
        return;

    // parse arguments and the base command
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift()?.toLowerCase();

    // handle commands
    if (command === "ping") {
      return message.channel.send(`Pong. 🏓 \n**Latency**: ${client.ws.ping}ms`);
     }
 });
```
> This part is the messaging handling. Once the bot recieves a message **in a channel it has permissions to read messages**, the bot checks if the correct prefix is used (i.e.: the user is runnning a command for this bot) and then parses the string into commands and arguments. Then a series of if / else if statements handle the commands, this is where the bot can respond with a message, reaction, deleting a message or a series of messages or a API fetch and response!


## Getting Started
* Clone or fork this repository.
```
git clone
```

* Install all dependencies with [npm](https://nodejs.org/)
```
npm install
```

* Create a Discord application using the [Discord Developer Portal](https://discord.com/developers/applications). Go to bot and copy the token, ⚠️ **don't give this token to anyone as this gives full control of your bot** ⚠️, paste this token in a `.env` file.
```
DiscordBotToken = <your token>
```

* Add the bot to your server: Go to the OAuth2 section of your application and select bot in the scopes, then select the permissions you want to give the bot. Copy the link and add to your server! You must be administrator of the server to add bots.

* Run the project as developer
```
npm run dev
```

* Run the project in production
```
npm run prod
```

## Contributions
> If you're new to open source contributions read [this guide](https://opensource.guide/how-to-contribute/). Issues and pull requests are welcome! If you have any feature requests post them in the issues as well! 

