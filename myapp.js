// File Created: 2023-10-22

global.DEBUG = true;


/* --------------------------------------------------- */
/*              Load all needed modules                */
/* --------------------------------------------------- */

const fs = require('fs');
const { initApp } = require('./init.js');
const { configApp } = require('./config.js');

/* --------------------------------------------------- */
/* --------------------------------------------------- */


const myArgs = process.argv.slice(2); // Grab the command line arguments after the first two

if (DEBUG) if (myArgs.length >= 1) console.log('myApp.js arguments: ', myArgs);

// Top level switch statement for the first command line argument (myArgs[0])
switch (myArgs[0]) {

    // Call the initApp() function from init.js
    case 'init':
    case 'i':
        if (DEBUG) console.log(myArgs[0], ' --> Initialize the app.')
        initApp();
        break;

    // Call the configApp() function from config.js
    case 'config':
    case 'c':
        if (DEBUG) console.log(myArgs[0], ' --> Configure the app')
        configApp();
        break;

    // Call the tokenApp() function from token.js
    case 'token':
    case 't':
        if (DEBUG) console.log(myArgs[0], ' --> Generate a user token.')
        tokenApp();
        break;

    // Display the usage.txt command help file
    case 'help':
    case 'h':
    default:

        fs.readFile(__dirname + '/usage.txt', 'utf8', (error, data) => {
            if (error) {
                console.error(error);
            } else {
            console.log(data);
            }
        });

}