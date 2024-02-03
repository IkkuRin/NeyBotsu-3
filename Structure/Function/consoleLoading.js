const { reset } = require('./consoleColor');

async function consoleWait(words, duration, speed, finished, newLine) {
    let i = 0;

    var interval = setInterval(() => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        i = (i + 1) % 4;
        var dot = new Array(i + 1).join('.');
        process.stdout.write(words + dot + reset);
    }, speed);
    setTimeout(() => {
        clearInterval(interval);
        if (finished) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(`${finished}${reset}`);
        }
        newLine == true ? process.stdout.write(`${reset}\n`) : null;
    }, duration);
}

module.exports = { consoleWait };
