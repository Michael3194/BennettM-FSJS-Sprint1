global.DEBUG = true;

const fs = require('fs');

const myArgs = process.argv.slice(2);

if (DEBUG) if (myArgs.length >= 1) console.log('myApp.js arguments: ', myArgs);

switch (myArgs[0]) {

    case 'init':
    case 'i':
        if (DEBUG) console.log(myArgs[0], ' --> initialize the app.')
        initializeApp();
        break;

    case 'config':
    case 'c':
        if (DEBUG) console.log(myArgs[0], ' --> Display the configuration file: config.json.')
        configApp();
        break;

    case 'token':
    case 't':
        if (DEBUG) console.log(myArgs[0], ' --> Generate a user token.')
        tokenApp();
        break;

    case 'help':
    case 'h':
    default:

        fs.readFile(__dirname + '/usage.txt', 'utf8', (error, data) => {
            if (error) console.error(error);
            console.log(data);

        })

}