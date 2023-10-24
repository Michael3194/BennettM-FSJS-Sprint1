// File Created: 2023-10-22

/* ------- Load needed modules ------- */

// Load the filesystem module to work with files
const fs = require('fs');
const fsPromises = require('fs').promises;

// Load the path module to work with file paths
const path = require('path');

// Load our logEvents module to use the logEvents function
const logEvents = require('./logEvents.js');

// Add an event emitter using the events module
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};

// Create an event emitter object
const myEmitter = new MyEmitter();

// Add an event listener for log events
myEmitter.on('log', (event, level, message) => {
    logEvents(event, level, message);
})

// Add what we need from our './templates.js' module
const { folders, configjson, usagetxt } = require('./templates.js');


/* --- Functions --- */

function createFolders() {

    if (DEBUG) console.log('calling init.js ==> createFolders()')

    myEmitter.emit('log', 'init.createFolders()', 'INFO', 'Trying to create all folders');

    let foldersCreated = 0; // To keep track of the number of folders created

    // Loop through the folders array
    folders.forEach(folderName => {

        if (DEBUG) console.log(folderName)
        try {

            // Check to see if the folder does not already exist
            if (!fs.existsSync(path.join(__dirname, folderName))) {

                // If it does not exist, create it
                fsPromises.mkdir(path.join(__dirname, folderName));
                foldersCreated++; // Increment the foldersCreated variable
            }

        } catch (error) {

            // If there is an error, log it
            myEmitter.emit('log', 'init.createFolders()', 'ERROR', error);
        }
    });

    if (foldersCreated === 0) { // If no folders were created

        if (DEBUG) console.log('All folders already exist.')
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders already exist.')

    } else if (foldersCreated < folders.length) { // Else if some folders were created

        if (DEBUG) console.log(`${foldersCreated} of ${folders.length} folders were created.`);

        myEmitter.emit('log', 'init.createFolders()', 'INFO', `${foldersCreated} of ${folders.length} folders were created.`);

    } else { // Else all folders were created

        if (DEBUG) console.log('All folders were created.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders were created.');
    }
}
