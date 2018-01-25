const readDir = require('fs').readdirSync;

const files = readDir('./src/locale/lang');

module.exports = files.reduce((entry, file) => {
    const name = file.split('.').shift();

    return Object.assign(entry, {
        [name]: `./src/locale/lang/${file}`,
    });
}, {});
