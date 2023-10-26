// File Created: 2023-10-26

/* --------------------------------------------------- */
/*              Load all needed modules                */
/* --------------------------------------------------- */

const fs = require('fs'); // To work with files
const logEvents = require('./logEvents.js'); // Load our logEvents file to use the logEvents()


// Add an event emitter using the events module
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};
const myEmitter = new MyEmitter(); // Create an event emitter object


// Add what we need from our './templates.js' module
const { configjson } = require('./templates.js');


// Add an event listener for log events
myEmitter.on('log', (event, level, message) => {
    logEvents(event, level, message);
})

/* --------------------------------------------------- */
/* --------------------------------------------------- */

// Grab the command line arguments after the first two
const myArgs = process.argv.slice(2);

function displayConfig() {

    if (DEBUG) console.log('config.displayConfig()');
    myEmitter.emit('log', 'config.displayConfig()', 'INFO', 'Display the config.json file.');

    // Read the config.json file
    fs.readFile(__dirname + '/json/config.json', 'utf-8', (error, data) => {

        if (error) {
                
                myEmitter.emit('log', 'config.displayConfig()', 'ERROR', error);
        }

        // Display the config.json file
        console.log(JSON.parse(data));
    })

    myEmitter.emit('log', 'config.displayConfig()', 'INFO', 'config.json file displayed successfully.');
}

function configApp() {

    // if (DEBUG) console.log('config.configApp()');
    myEmitter.emit('log', 'config.configApp()', 'INFO', 'Calling configApp()');

    // Switch statement to handle all config command options
    switch (myArgs[1]) { 

        case '--show':
            if (DEBUG) console.log('config.configApp() --show. ( Display the config.json file ).');
            myEmitter.emit('log', 'config.configApp() --show', 'INFO', 'Display the config.json file.');

            displayConfig();
            break;


        case '--reset':
            if (DEBUG) console.log('config.configApp() --> --reset.')

            // resetConfig();
            break;

        
        case '--set':

            if (DEBUG) console.log('config.configApp() --> --set.');
            // setConfig();
            break;


        case '--help':
        case '--h':
        default:

            if (DEBUG) console.log('config.configApp() --> --help.');
            myEmitter.emit('log', 'config.configApp() --help', 'INFO', 'Display the config.txt file.');
            
            // Display the usage.txt file
            fs.readFile(__dirname + '/views/config.txt', 'utf-8', (error, data) => {

                if (error) { // Handle any errors displaying the config.txt file

                    console.log(`Error displaying the config.txt file, ${error}`)
                    throw error;
                }

                console.log(data);
                myEmitter.emit('log', 'config.configApp() --help', 'INFO', 'config.txt file displayed successfully.');
            })
    }
}

module.exports = {
    configApp
}