// Importing the required packages and modules
const { glob } = require('glob');
const path = require('path');
const { fg, bright, reset } = require('./consoleColor');

// Defining cache delete funtion
async function deleteCache(file) {
    const filePath = path.resolve(file); // Resolve the filepath
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

// Defining filr loader function
async function loader(directory) {
    // Basically just for esthetic purposes
    // Defining a colored console loading logs every time an folder is loaded
    let self = path.basename(__filename).split('.')[0].toUpperCase();
    self = fg.green + bright + '[' + self + ']' + reset;
    console.log(
        `${self} Loading ${fg.yellow + bright + directory.split('/').slice(1) + reset}...`
    );

    try {
        // Defining glob patterns
        const files = await glob(
            path.join(process.cwd(), directory, '**/*.js').replace(/\\/g, '/')
        );

        // Filters only file that ends with .js extension
        const jsFiles = files.filter((file) => path.extname(file) === '.js');
        // Looping through all the files
        for (const file of jsFiles) {
            // Fancy loading file stuff
            console.log(
                `${self} Loading ${fg.yellow + file.split('/').pop() + reset}...`
            );
        }

        // During the loop, we delete the cache of the file
        await Promise.all(jsFiles.map(deleteCache));

        return jsFiles;
    } catch (error) {
        // Logs any errors that occured
        console.error(
            `Error loading files from directory ${directory}: ${error}`
        );
        throw error;
    }
}

module.exports = { loader };
