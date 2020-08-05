const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

const bot = new Discord.Client();
bot.login(token);


// Stations
const stations = [];
const nrj = bot.voice.createBroadcast();
const nrjPl = nrj.play("https://scdn.nrjaudio.fm/fi/35061/mp3_128.mp3?cdn_path=adswizz_lbs9&adws_out_a1");
nrjPl.setVolume(0.1)

const nova = bot.voice.createBroadcast();
const novaPl = nova.play("https://stream.bauermedia.fi/radionova/radionova_128.mp3");
novaPl.setVolume(0.1)

const connection = [];

// Basic Listeners

bot.once('ready', () => {
	console.log('Ready!');
});
bot.once('reconnecting', () => {
	console.log('Reconnecting!');
});
bot.once('disconnect', () => {
	console.log('Disconnect!');
});


// Messages

bot.on('message', async message => {
	if (!message.guild) return
	if (message.author.bot) return;
	if (!message.content.startsWith(prefix + "radio")) return;
	let args = message.content.split(' ');
	if (!args[1]) {
		howto();
		return;
	}
	if (!message.member.voice.channel) {
		message.channel.send("You need to join a voice channel first!");
	}
	switch (args[1]) {
		case "play":
			if (!args[2]) {
				howto();
				return;
			}
			if (stations[args[2]]) {
				connection[message.guild.id] = await message.member.voice.channel.join();
				if (args[2] === "nrj") {
					connection[message.guild.id].play(nrj);
					return;
				}
				if (args[2] === "nova") {
					connection[message.guild.id].play(nova);
					return;
				}
			} else {
				message.channel.send("I didn't recognize that radio station. You can get available stations with ``' + prefix + 'radio stations``");
				return;
			}
			return;
		case "stop":
			if (!message.member.voice.channel) {
				message.channel.send("You have to be in a voice channel to stop the music!");
				return;
			}
			if (connection[message.guild.id]) {
				connection[message.guild.id].disconnect();
			}
	}
});