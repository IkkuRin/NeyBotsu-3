const er = require('../Storage/RandomResponse/embedArray');
const tr = require('../Storage/RandomResponse/responseArray');

class randRes {
    constructor(from, parts, inter, cli) {
        this.parts = parts;
        this.from = from;
        this.cli = cli;
        this.inter = inter;
        this.randomizer = (arr) => arr[Math.floor(Math.random() * arr.length)];
        this.incAndReplace = (input, toReplace, replaceWith) => {
            do {
                input = input.replace(toReplace, replaceWith);
            } while (input.includes(toReplace));
            return input;
        };
    }

    embeds() {
        var embeds = new Object();

        var embedFrom = er[this.from];
        var embedParts = embedFrom[this.parts];
        const MorI = this.inter?.user ?? this.inter?.author;

        embeds['title'] = this.randomizer(embedParts.title);
        embeds['description'] = this.randomizer(embedParts.description);

        embeds.title = this.incAndReplace(
            embeds['title'],
            '@me',
            this.cli.user.username
        );
        embeds.description = this.incAndReplace(
            embeds['description'],
            '@me',
            this.cli.user.username
        );

        embeds.title = this.incAndReplace(
            embeds['title'],
            '@user',
            MorI.username
        );
        embeds.description = this.incAndReplace(
            embeds['description'],
            '@user',
            MorI
        );

        return embeds;
    }

    texts() {
        var textFrom = tr[this.from];
        var textParts = textFrom[this.parts];
        const MorI = this.inter?.user ?? this.inter?.author;

        textParts = this.incAndReplace(
            textParts,
            '@me',
            this.cli.user.username
        );
        textParts = this.incAndReplace(textParts, '@user', MorI);

        return this.randomizer(textParts);
    }
}

module.exports = randRes;
