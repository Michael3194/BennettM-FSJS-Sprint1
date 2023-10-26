// File Created: 2023-10-22

/* --------------------------------------------------- */
/*              Load all needed modules                */
/* --------------------------------------------------- */

const fs = require('fs'); // To work with files
const fsPromises = require('fs').promises; // Provides promise based functions for fs module
const path = require('path'); // To work with file a directory paths

// Load our logEvents file to use the logEvents function
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
const { folders, configjson, tokenjson, usagetxt, inittxt, configtxt, tokentxt } = require('./templates.js');


/* --------------------------------------------------- */
/*                   createFolders()                   */
/* --------------------------------------------------- */

function createFolders() {

    if (DEBUG) console.log('calling init.createFolders()');

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
            console.error(error);
            myEmitter.emit('log', 'init.createFolders()', 'ERROR', error);
        }
    });

    if (foldersCreated === 0) { // If no folders were created

        if (DEBUG) console.log('All folders already exist.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders already exist.')

    } else if (foldersCreated < folders.length) { // Else if some folders were created

        if (DEBUG) console.log(`${foldersCreated} of ${folders.length} folders were created.`);

        myEmitter.emit('log', 'init.createFolders()', 'INFO', `${foldersCreated} of ${folders.length} folders were created.`);

    } else { // Else all folders were created

        if (DEBUG) console.log('All folders were created.');
        myEmitter.emit('log', 'init.createFolders()', 'INFO', 'All folders were created.');
    }
}


/* --------------------------------------------------- */
/*                   createFiles() */
/* --------------------------------------------------- */

function createFiles() {
    // Logging
    if (DEBUG) console.log('calling init.js --> createFiles()');
    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'Trying to create all files.');

    try {

        let configData = JSON.stringify(configjson, null, 2);

        // Check to see if the config.json file does not already exist
        if (!fs.existsSync(path.join(__dirname, './json/config.json'))) {

            // Check to see if the json folder exists first
            if (!fs.existsSync(path.join(__dirname, './json'))) {

                // If it does not exist, create it
                fsPromises.mkdir(path.join(__dirname, './json'))
            }

            fs.writeFile('./json/config.json', configData, (error) => {

                // Deal with any errors
                if (error) {
                    console.error(error);
                    myEmitter.emit('log', 'init.createFiles()', 'ERROR', error);
                
                // If no errors, log the success
                } else {

                    if (DEBUG) console.log('Data written to config.json file.');
                    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'Data written to config.json file successfully.');

                }
            })

        } else { // Else the config.json file aready exists

            if (DEBUG) console.log('The config.json file already exists.');
            myEmitter.emit('log', 'init.createFiles()', 'INFO', 'The config.json file already exists.');
        }

        // Check to see if the usage.txt file does not already exist
        writeFile('usage.txt', usagetxt);
        // Check to see if the init.txt file does not already exist
        writeFile('init.txt', inittxt);
        // Check to see if the config.txt file does not already exist
        writeFile('config.txt', configtxt);
        // Check to see if the token.txt file does not already exist
        writeFile('token.txt', tokentxt);

} catch (error) {
    
        // If there is an error, log it
        console.error(error);
        myEmitter.emit('log', 'init.createFiles()', 'ERROR', error);
}
}


/* --------------------------------------------------- */
/*                   writeFile()                       */
/* --------------------------------------------------- */



async function writeFile(fileName, data) {
    if (DEBUG) console.log(`Calling init.writeFile(${fileName})`);
    const filePath = path.join(__dirname, 'views', fileName);

    try {
        // Check if the file exists
        await fsPromises.access(filePath);
        console.log(`File ${fileName} already exists.`);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File does not exist, create it
            try {
                await fsPromises.writeFile(filePath, data);
                console.log(`File ${fileName} created.`);
            } catch (writeError) {
                console.error(`Error creating file ${fileName}:`, writeError);
            }
        } else {
            console.error(`Error accessing the file ${fileName}:`, error);
        }
    }
}



/* --------------------------------------------------- */
/*                   initApp()                         */
/* --------------------------------------------------- */
const myArgs = process.argv.slice(2);

function initApp() {

    if (DEBUG) console.log('calling init.initApp()');
    myEmitter.emit('log', 'init.initApp()', 'INFO', 'Initializing the app.');

    switch (myArgs[1]) {

        case '--all':

            if (DEBUG) console.log(`${myArgs[1]} --> createFolders() and createFiles()`);
            createFolders();
            createFiles();

            myEmitter.emit('log', myArgs, 'INFO', 'Create all folders and files.');
            break;

        case '--cat':

            if (DEBUG) console.log(`${myArgs[1]} --> createFiles()`);
            myEmitter.emit('log', myArgs, 'INFO', 'Create all files.')

            // First call createFolders() to make sure all folders already exist
            createFolders();
            // Then call createFiles() to create all files
            createFiles();

            break;
        
        case '--mk':
                
                if (DEBUG) console.log(`${myArgs[1]} --> createFolders()`);
                myEmitter.emit('log', myArgs, 'INFO', 'Create all folders.');
    
                // Call createFolders() to create all folders
                createFolders();
    
                break;

        case '--help':
        case '--h':
        default:

            // Check if the views folder exists and if init.txt file exists

            fs.readFile(__dirname + '/views/init.txt', (error, data) => {
                
                if (error) {
                    console.log('Error reading init.txt file. Try running init with --all option to create the folders and files first.')
                } else {

                console.log(data.toString()); // If no errors, display the data from the file

                }
            })
    }
}

module.exports = { 
    initApp,
};
