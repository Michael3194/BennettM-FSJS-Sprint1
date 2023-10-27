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

function tokenCount() {

    
}
