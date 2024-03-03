function formatCustomEmojis(list) {
    // Split the list into individual emoji strings
    const emojiStrings = list.split(',\n');

    // Initialize an empty array to hold the formatted objects
    const formattedEmojis = new Object();

    // Regular expression to match the emoji string pattern
    const regex = /(.*): '<:(.*):(\d+)>'/;

    // Iterate over each emoji string
    emojiStrings.forEach((emojiString) => {
        // Extract the name and id using the regex
        const match = emojiString.match(regex);
        if (match) {
            // Push the formatted object to the array
            formattedEmojis[match[1]] = {
                emoji: `<:${match[2]}:${match[3]}>`,
                name: match[2],
                id: match[3]
            };
        }
    });

    // Return the array of formatted objects
    return formattedEmojis;
}

// Your list of custom emoji strings
const emojiList = `online: '<:online:1205174497364279337>',
offline: '<:offline:1205174501474828399>',
dnd: '<:dnd:1205174493903855647>',
idle: '<:idle:1205174509456597142>',
username: '<:username:1205301956248076328>',
Partner: '<:DiscordPartner:1205305545234587708>',
ActiveDeveloper: '<:ActiveDevs:1205305549181423666>',
Staff: '<:Staff:1205305553694359583>',
CertifiedModerator: '<:CertifiedModerator:1205305572325466152>',
BugHunterLevel2: '<:BugHunter2:1205305589031374858>',
VerifiedDeveloper: '<:EarlyDevs:1205305603958771784>',
CertifiedModeratorOld: '<:ModeratorAlumni:1205305609080021004>',
VerifiedBot: '<:Verified:1205305626134192188>',
HypesquadAnimated: '<:Hypesquad:1205305633943851008>',
Nitro: '<:Nitro:1205305637941022780>',
Partner: '<:PartneredServerOwner:1205305651212066836>',
ServerSubscription: '<:ServerSubscription:1205305656530182144>',
BugHunterLevel1: '<:BigHunter1:1205305667728965683>',
Hypesquad: '<:HypesquadEvent:1205305760117030923>',
HypeSquadOnlineHouse3: '<:HouseOfBalance:1205305765657583646>',
HypeSquadOnlineHouse1: '<:HouseOfBravery:1205305772054155264>',
HypeSquadOnlineHouse2: '<:HouseOfBriliance:1205305782615154768>',
PremiumEarlySupporter: '<:EarlySupporter:1205319298726498344>'`;

// Format the list
const formattedEmojis = formatCustomEmojis(emojiList);

// Save to emojis.json
const fs = require('fs');
fs.writeFileSync(
    'Structure/Storage/Assets/Emojis/emojis.json',
    JSON.stringify(formattedEmojis, null, `\t`)
);

// Output the formatted list
console.log('Formatted and saved');
