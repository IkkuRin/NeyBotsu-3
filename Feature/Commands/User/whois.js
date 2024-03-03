const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const fs = require('fs');

const emoji = JSON.parse(fs.readFileSync('Structure/Storage/Assets/Emojis/emojis.json'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Who is that members?')
        .addUserOption((opt) =>
            opt.setName('member').setDescription('Input a members')
        ),
    exec(cli, inter) {
        const { options } = inter;

        const member = options.getMember('member') || inter.member;

        const about = {
            tag: member.user.tag,
            dName: member.user.globalName,
            nick: member.nickname,
            bot: member.user.bot,
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
                };
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

        const badges = new Array();
        if (member.user.flags.toArray()) {
            for (const badge of member.user.flags.toArray()) {
                badges.push({
                    name: badge,
                    emoji: cli.emojis.resolve(e => e.id == emoji[badge].id)
                });
            }
        }

        const formattedTime = (ms) =>
            moment(ms).format('ddd, MMM Do YYYY | hh:mmA');

        const embed = new EmbedBuilder()
            .setColor(cli.color)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Member Information`)
            .setDescription(
                `# ${member.user.username.toUpperCase()}${about.bot ? ` ***\` Bots \`***` : ''}\n**${status.emoji} ${status.status}**\n**Badges:**\n${badges.map((b) => b.emoji || b.name).join(' ')}`
            )
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
                    value: about.roles || '**Has no roles**'
                },
                {
                    name: `Banner`,
                    value: about.banner
                        ? `[Link](${about.banner})`
                        : `**Color:** \` ${about.color} \``
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
};
