const {
	ContextMenuCommandBuilder,
	ApplicationCommandType,
	EmbedBuilder,
} = require('discord.js');
const moment = require('moment');
var emoji = require(process.cwd() + '/Structure/Storage/Assets/Emojis/emojis.js');


module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Whois')
		.setType(ApplicationCommandType.User),
	exec (cli, inter ) {
        const member = inter.targetMember;

        const about = {
            tag: member.user.tag,
            dName: member.user.globalName,
            nick: member.nickname,
            id: member.user.id,
            created: member.user.createdTimestamp,
            joined: member.joinedTimestamp,
            color: member.displayHexColor,
            booster: member.premiumSinceTimestamp,
            roles: member.roles.cache
                .map((r) => r)
                .slice(0, -1)
                .join(', '),
            banner: member.user.bannerURL({ dynamic: true })
        };

        let status;
        switch (member.presence?.status ?? 'offline') {
            case 'online':
                status = {
                    status: 'Online',
                    emoji: emoji.online
                };;
                break;
            case 'idle':
                status = {
                    status: 'Idle',
                    emoji: emoji.idle
                };
                break;
            case 'dnd':
                status = {
                    status: 'Do Not Disturb',
                    emoji: emoji.dnd
                };
                break;
            case 'offline':
                status = {
                    status: 'Offline',
                    emoji: emoji.offline
                };
                break;
        }

        const descArr = [
            `# ${member.user.username.toUpperCase()}`,
            `***${status.emoji} ${status.status}***`
            ];
        
        const formattedTime = (ms) => moment(ms).format('ddd, MMM Do YYYY | hh:mmA');

        const embed = new EmbedBuilder()
            .setColor(cli.color)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Member Information`)
            .setDescription(descArr.join('\n'))
            .addFields(
                {
                    name: 'Username',
                    value: `\` ${about.tag} \``,
                    inline: true
                },
                {
                    name: 'Display Name',
                    value: `\` ${about.dName ?? 'No Display Name'} \``,
                    inline: true
                },
                {
                    name: 'Nickname',
                    value: `\` ${about.nick ?? 'No Nickname'} \``,
                    inline: true
                },
                {
                    name: 'User ID',
                    value: '```js\n' + about.id + '```'
                },
                {
                    name: 'Joined to Discord',
                    value: `\` ${formattedTime(about.created)} \``,
                    inline: true
                },
                {
                    name: 'Joined to Server',
                    value: `\` ${formattedTime(about.joined)} \``,
                    inline: true
                },
                {
                    name: 'Booster',
                    value: `${about.booster ? `**Since:** ${formattedTime(about.booster)}` : '` No `'}`,
                    inline: true
                },
                {
                    name: `Roles`,
                    value: about.roles ?? '**Has no roles**'
                },
                {
                    name: `Banner`,
                    value: about.banner ? `[Link](${about.banner})` : `**Color:** \` ${about.color} \``,
                }
            )
            .setFooter({
                text: `Requested by ${inter.user.username}`,
                iconURL: inter.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        if (about.banner) embed.setImage(about.banner);

        inter.reply({ embeds: [embed] });
	}
}

