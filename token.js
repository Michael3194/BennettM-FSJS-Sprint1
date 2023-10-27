// File Created: 2023-10-27

/* --------------------------------------------------- */
/*              Load all needed modules                */
/* --------------------------------------------------- */

const logEvents = require('./logEvents.js'); // Load our logEvents file to use the logEvents()

// Add an event emitter using the events module
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter(); // Create an event emitter object


// Common Core Modules
const fs = require('fs'); // To work with files
const fsPromises = fs.promises; // To work with files using promises
const path = require('path'); // To work with file a directory paths


// NPM Installed Modules
const crc32 = require('crc/crc32'); // Used to generate a token
 const { format } = require('date-fns'); // Used to format the date and time.


// Add an event listener for log events
myEmitter.on('log', (event, level, message) => {
    logEvents(event, level, message);
});


// Grab the command line arguments after the first two
const myArgs = process.argv.slice(2);



/* --------------------------------------------------- */
/*                   tokenCount()                      */
/* --------------------------------------------------- */
/*     This function displays the number of tokens     */
/*              in the token.json file.                */
/* --------------------------------------------------- */
/* --------------------------------------------------- */

function tokenCount() {

    if (DEBUG) console.log('token.tokenCount() --> Display the number of tokens in the token.json file.');
    myEmitter.emit('log', 'INFO', 'token.tokenCount()', '[--count] Display the number of tokens in the token.json file.');

    // Read the token.json file
    fsPromises.readFile(path.join(__dirname, 'json/token.json'), 'utf8')
    .then((data) => {

        // Parse the JSON data
        const tokenData = JSON.parse(data);

        // Display the number of tokens
        console.log(`Number of tokens: ${tokenData.length}`);
        myEmitter.emit('log', 'INFO', 'token.tokenCount()', `Number of tokens: ${tokenData.length}`);

    })

    .catch((error) => {
        myEmitter.emit('log', 'ERROR', 'tokenCount()', error);
        console.error(error);
    });
} // End of tokenCount()


/* --------------------------------------------------- */
/*                   tokenList()                       */
/* --------------------------------------------------- */
/*     This function displays the tokens in the        */
/*              token.json file.                       */
/* --------------------------------------------------- */
/* --------------------------------------------------- */


function tokenList() {

    if (DEBUG) console.log('token.tokenList() --> Display the tokens in the token.json file.')
    myEmitter.emit('log', 'INFO', 'token.tokenList()', '[--list] Display the tokens in the token.json file.');

    // Read the token.json file
    fsPromises.readFile(path.join(__dirname, 'json/token.json'), 'utf8')
    .then((data) => {

        // Parse the JSON data
        const tokenData = JSON.parse(data);

        // Display the tokens
        console.log('Tokens:');

        tokenData.forEach((token, index) => {
            console.log(`Token ${index + 1}: ${JSON.stringify(token, null, 2)}`);
        })

        myEmitter.emit('log', 'INFO', 'token.tokenList()', 'Tokens displayed in the console successfully.');


    })

    .catch((error) => {
        
        console.error(error);
        myEmitter.emit('log', 'ERROR', 'token.tokenList()', error);
    })

}


/* --------------------------------------------------- */
/*                      tokenApp()                     */
/* --------------------------------------------------- */
/*      This function contains a switch statement      */
/*     that handles the command line arguments for     */
/*                  the token.js file.                 */
/* --------------------------------------------------- */
/* --------------------------------------------------- */

function tokenApp() {

    if (DEBUG) console.log('token.tokenApp()');
    myEmitter.emit('log', 'INFO', 'token.tokenApp()', 'Calling tokenApp()');

    switch (myArgs[1]) {

        case '--count':
            if (DEBUG) console.log('token.tokenApp() --count');
            tokenCount();
            break;
        
        case '--list':
            if (DEBUG) console.log('token.tokenApp() --list');
            tokenList();
            break;


    }
}


module.exports = { tokenApp };