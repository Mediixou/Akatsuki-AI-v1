const { Client, GatewayIntentBits, PermissionFlagsBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const { Hercai } = require('hercai');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers], partials: [Partials.Channel] });
const TOKEN = 'Token_Your_Bot';
const CONFIG_FILE = './channelConfig.json';
const WELCOME_CONFIG_FILE = './channelwelcome.json';

const herc = new Hercai();

let channelConfig = {};
if (fs.existsSync(CONFIG_FILE)) {
    channelConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

let channelwelcome = {};
if (fs.existsSync(WELCOME_CONFIG_FILE)) {
    channelwelcome = JSON.parse(fs.readFileSync(WELCOME_CONFIG_FILE, 'utf-8'));
}

const welcomeMessages = [
    "Bienvenue {user}! sur le serveur, j'espère que tu vas aimer ! Nous sommes maintenant {memberCount} membres.",
    "Salut {user}! Bienvenue parmi nous. Nous avons maintenant {memberCount} membres. Profite bien !",
    "Hello {user}! Bienvenue sur notre serveur. Nous sommes {memberCount} membres maintenant.",
    "Bienvenue, {user}! Le serveur compte maintenant {memberCount} membres. Nous sommes ravis de t'accueillir !",
    "Salut {user}! Le serveur a atteint {memberCount} membres avec ton arrivée. Bienvenue !"
];

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}!`);
    
     function Status(){
                    client.user.setPresence({
                        status: 'online',
                        activities: [{
                                type: ActivityType.Custom,
                                name: 'customname',
                                state: 'Mentionne-moi !'
                        }]
                    })
                   } 
                   
                   Status();
                   setInterval(Status, 30000);
    
});



client.on('guildMemberAdd', async (member) => {
    const guildId = member.guild.id;

    const channelId = channelwelcome[guildId];
    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);
    if (!channel) return;

    const randomMessageTemplate = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    const message = randomMessageTemplate
        .replace('{user}', member.toString())
        .replace('{memberCount}', member.guild.memberCount);

    channel.send(message);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('i!set-channelwelcome')) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply(`${message.author}, seuls les administrateurs peuvent exécuter cette commande.`);
        }

        const args = message.content.split(' ');
        const channelMention = args[1];

        if (!channelMention) {
            return message.reply(`${message.author}, Veuillez mentionner un canal valide, comme ceci : \`ai!set-channelwelcome #nom-du-canal\``);
        }

        const channel = message.mentions.channels.first();

        if (!channel) {
            return message.reply(`${message.author}, La mention du canal est invalide. Veuillez réessayer en mentionnant correctement un canal.`);
        }

        const channelId = channel.id;
        const guildId = message.guild.id;

        const botMember = message.guild.members.cache.get(client.user.id);
        if (!botMember || !botMember.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) {
            return message.reply(`Je n'ai pas les permissions nécessaires pour envoyer des messages dans ${channel}. Assure-toi que j'ai la permission "Envoyer des messages" dans ce salon.`);
        }

        channelwelcome[guildId] = channelId;
        fs.writeFileSync(WELCOME_CONFIG_FILE, JSON.stringify(channelwelcome, null, 2));

        await message.reply(`Le bot va dire bienvenue à tous les nouveaux membres dans ${channel}.`);
        return;
    }

    if (message.content.startsWith('i!set-channelai')) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply(`${message.author}, seuls les administrateurs peuvent exécuter cette commande.`);
        }

        const channelId = message.channel.id;
        const guildId = message.guild.id;

        const botMember = message.guild.members.cache.get(client.user.id);
        if (!botMember || !botMember.permissionsIn(message.channel).has(PermissionFlagsBits.SendMessages)) {
            return message.reply(`Je n'ai pas les permissions nécessaires pour envoyer des messages dans ce salon. Assure-toi que j'ai la permission "Envoyer des messages" dans ce salon.`);
        }

        channelConfig[guildId] = channelId;
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(channelConfig, null, 2));

        await message.reply(`Le bot répondra maintenant aux questions dans ce salon.`);
        return;
    }

    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.channel.send(`**・Mon préfixe est :** \`i!\`\nFait \`i!set-channelai\` sur le salon que vous voulez pour configurer le Chat-AI.\nFait \`i!set-channelwelcome\` pour mentionner un salon et configurer le système de bienvenue !`);
    }

    const configuredChannelId = channelConfig[message.guild.id];
    if (message.channel.id !== configuredChannelId) return;

    const developerQuestion = message.content.toLowerCase();
    message.channel.sendTyping();


    try {
        const response = await herc.question({ model: "v3-beta", content: developerQuestion });

        const finalReply = `${response.reply}`;
        await message.reply(finalReply);
    } catch (error) {
        console.error('Erreur lors du traitement de la question:', error);
        await message.reply('Désolé, une erreur est survenue en traitant votre demande.');
    }
});

client.login(TOKEN);
