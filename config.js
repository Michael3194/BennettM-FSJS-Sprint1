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


// Grab the command line arguments after the first two
const myArgs = process.argv.slice(2);


/* --------------------------------------------------- */
/*                    displayConfig()                  */
/* --------------------------------------------------- */
/*     This function displays the config.json file     */
/* --------------------------------------------------- */

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

/* --------------------------------------------------- */
/*                      setConfig()                    */
/* --------------------------------------------------- */
/*     This function provides the ability to set a     */
/*  specific config.json property to the value given   */
/* --------------------------------------------------- */

function setConfig() {

    if (DEBUG) console.log('config.setConfig()');
    if (DEBUG) console.log(myArgs);
    myEmitter.emit('log', 'config.setConfig()', 'INFO', ` [--set] Set config.json "${myArgs[2]}" property to "${myArgs[3]}"`);
    
    let match = false; // Set a flag to false

    // Read the config.json file
    fs.readFile(__dirname + '/json/config.json', 'utf8', (error, data) => {

        if (error) {
            myEmitter.emit('log', 'config.setConfig()', 'ERROR', error);
        }

        let config = JSON.parse(data)

        if (DEBUG) console.log(config);

        // Loop through the config.json file object
        for (let key of Object.keys(config)) {

            if (key === myArgs[2]) {
                // Match found
                if (DEBUG) console.log('Match found');
                if (DEBUG) console.log(`Trying to set config.${key} to "${myArgs[3]}"`)

                myEmitter.emit('log', 'config.setConfig()', 'INFO', 'Match found');

                config[key] = myArgs[3]; // Set the property to the value entered
                match = true;
            }
        }

        if (!match) {
            // No match found
            if (DEBUG) console.log(`Invalid config key: ${myArgs[2]} try another key.`);
            // Emit log event for invalid config key
            myEmitter.emit('log', 'config.setConfig()', 'ERROR', `Invalid config property: ${myArgs[2]}, try another property.`);
        }

        if (DEBUG) console.log(config);

        data = JSON.stringify(config, null, 2); // Convert the object back to a string

        if (match) {
        // Write the config.json file
        fs.writeFile(__dirname + '/json/config.json', data, (error) => {

            // Error writing to config.json file
            if (error) { 
                if (DEBUG) console.log(`Error writing to config.json file: ${error}`);
                myEmitter.emit('log', 'config.setConfig()', 'ERROR', error);
            }

            // Success writing to config.json file
            if (DEBUG) console.log(`config.json "${myArgs[2]}" property set to "${myArgs[3]}" successfully.`);
            myEmitter.emit('log', 'config.setConfig()', 'INFO', `config.json "${myArgs[2]}" property set to "${myArgs[3]}" successfully.`);
        })
        }
    });
    
} // End of setConfig()


/* --------------------------------------------------- */
/*                    resetConfig()                    */
/* --------------------------------------------------- */
/*     This function resets the config.json file to    */
/*                      the default                    */
/* --------------------------------------------------- */

function resetConfig() {

    if (DEBUG) console.log('config.resetConfig()');
    myEmitter.emit('log', 'config.resetConfig()', 'INFO', ' [--reset] Reset the config.json file to the default.');

    let configData = JSON.stringify(configjson, null, 2); // Convert the object back to a string

    // Write the config.json file
    fs.writeFile(__dirname + '/json/config.json', configData, (error) => {

        // Handle any errors writing to the config.json file
        if (error) {
            if (DEBUG) console.log(`Error writing to config.json file: ${error}`);
            myEmitter.emit('log', 'config.resetConfig()', 'ERROR', error);
        } else {

        // Success writing to the config.json file
        if (DEBUG) console.log('config.json file reset successfully.');
        myEmitter.emit('log', 'config.resetConfig()', 'INFO', 'config.json file reset successfully.');
        }
    })
}


/* --------------------------------------------------- */
/*                    configApp()                      */
/* --------------------------------------------------- */
/*   This function contains a switch statement that    */
/*   handles all the possible config command options   */
/* --------------------------------------------------- */


function configApp() {

    // if (DEBUG) console.log('config.configApp()');
    myEmitter.emit('log', 'config.configApp()', 'INFO', 'Calling configApp()');

    // Switch statement to handle all config command options
    switch (myArgs[1]) { 

        case '--show': // Display the config.json file

            if (DEBUG) console.log('config.configApp() --show. ( Display the config.json file ).');
            myEmitter.emit('log', 'config.configApp() --show', 'INFO', 'Display the config.json file.');

            displayConfig();
            break;

        
        case '--reset': // Reset the config.json file to the default

            if (DEBUG) console.log('config.configApp() --> --reset.')

            resetConfig();
            break;

        
        case '--set': // Set a specific config.json property to the value given

            if (DEBUG) console.log('config.configApp() --> --set.');

            setConfig();
            break;


        // Display the config.txt file
        case '--help':
        case '--h':
        default:

            if (DEBUG) console.log('config.configApp() --> --help.');
            myEmitter.emit('log', 'config.configApp() --help', 'INFO', 'Display the config.txt file.');
            
            // Read the config.txt file
            fs.readFile(__dirname + '/views/config.txt', 'utf-8', (error, data) => {
                
                if (error) { // Handle any errors reading the config.txt file

                    console.log(`Error displaying the config.txt file, ${error}`)
                    throw error;
                }

                // Success reading the config.txt file
                console.log(data); // Display the config.txt file
                myEmitter.emit('log', 'config.configApp() --help', 'INFO', 'config.txt file displayed successfully.');
            })
    }
} // End of configApp()



/* --------------------------------------------------- */
/*                    Module exports                   */
/* --------------------------------------------------- */

module.exports = {
    configApp
}