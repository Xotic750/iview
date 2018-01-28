const fs = require('fs');
const resolve = require('./resolve');

const files = fs.readdirSync(resolve('src/locale/lang'));

module.exports = files.reduce((entry, file) => {
    const name = file.split('.').shift();

    return Object.assign(entry, {
        [name]: resolve(`/src/locale/lang/${file}`),
    });
}, {});
