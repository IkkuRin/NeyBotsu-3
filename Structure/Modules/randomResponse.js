const er = require('../Storage/RandomResponse/embedArray');
const tr = require('../Storage/RandomResponse/responseArray');

function randRes(from, parts, inter, cli) {
    var randomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];
    var incAndReplace = (input, toReplace, replaceWith) => {
        do {
            input = input.replace(toReplace, replaceWith);
        } while (input.includes(toReplace));
        return input;
    };

    const embeds = () => {
        var embeds = new Object();

        var embedFrom = er[from];
        var embedParts = embedFrom[parts];
        const MorI = inter?.user ?? inter?.author;

        embeds['title'] = randomizer(embedParts.title);
        embeds['description'] = randomizer(embedParts.description);

        embeds.title = incAndReplace(embeds['title'], '@me', cli.user.username);
        embeds.description = incAndReplace(
            embeds['description'],
            '@me',
            cli.user.username
        );

        embeds.title = incAndReplace(embeds['title'], '@user', MorI.username);
        embeds.description = incAndReplace(
            embeds['description'],
            '@user',
            MorI
        );

        return embeds;
    };

    const texts = () => {
        var textFrom = tr[from];
        var textParts = textFrom[parts];
        const MorI = inter?.user ?? inter?.author;

        textParts = incAndReplace(textParts, '@me', cli.user.username);
        textParts = incAndReplace(textParts, '@user', MorI);

        return randomizer(textParts);
    };

    return {
        texts,
        embeds
    };
}

module.exports = randRes;
