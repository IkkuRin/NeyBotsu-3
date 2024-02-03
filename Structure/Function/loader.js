const { glob } = require('glob');
const path = require('path');

async function deleteCache(file) {
    const filePath = path.resolve(file);
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
}

async function loader(directory) {
    try {
        const files = await glob(
            path.join(process.cwd(), directory, '**/*.js').replace(/\\/g, '/')
        );

        const jsFiles = files.filter((file) => path.extname(file) === '.js');

        await Promise.all(jsFiles.map(deleteCache));

        return jsFiles;
    } catch (error) {
        console.error(
            `Error loading files from directory ${directory}: ${error}`
        );
        throw error;
    }
}

module.exports = { loader };
