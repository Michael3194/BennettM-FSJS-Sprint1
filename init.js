// File: init.js
// File Created: 2023-10-22
// Author: Michael Bennett

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
const { folders, configjson, tokenjson, usagetxt, inittxt, configtxt, tokentxt, indexhtml, newtokenhtml, counthtml } = require('./templates.js');


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
/*                   createFiles()                     */
/* --------------------------------------------------- */
/*   Function that calls the writeTxtFile() and        */
/*   writeJsonFile() functions to create all files.    */
/* --------------------------------------------------- */
/* --------------------------------------------------- */

function createFiles() {
    setTimeout(() => { // Log events were being logged out of order sometimes so I added a timeout
    // Logging
    if (DEBUG) console.log('calling init.js --> createFiles()');
    myEmitter.emit('log', 'init.createFiles()', 'INFO', 'Trying to create all files.');

    try {

        // Check to see if the views folder exists first, if it doesn't, create it.
        if (!fs.existsSync(path.join(__dirname, './views'))) {
            fsPromises.mkdir(path.join(__dirname, './views'))
        };

        /* --------------------------------------------------- */
        /*               Create all .txt files                 */
        /* --------------------------------------------------- */

        // Use writeTxtFile() to check if usage.txt file exists, if it doesn't it creates it.
        writeTxtFile('usage.txt', usagetxt);
        // Use writeTxtFile() to check if init.txt file exists, if it doesn't it creates it.
        writeTxtFile('init.txt', inittxt);
        // Use writeTxtFile() to check if config.txt file exists, if it doesn't it creates it.
        writeTxtFile('config.txt', configtxt);
        // Use writeTxtFile() to check if token.txt file exists, if it doesn't it creates it.
        writeTxtFile('token.txt', tokentxt);

        /* --------------------------------------------------- */
        /*               Create all .json files                */
        /* --------------------------------------------------- */

        // Write the config.json file
        writeJsonFile('config.json', configjson)
        // Write the token.json file
        writeJsonFile('token.json', tokenjson)

        /* --------------------------------------------------- */
        /*               Create all .html files                */
        /* --------------------------------------------------- */

        // Write the index.html file
        writeHtmlFile('index.html', indexhtml, 'routes');
        // Write the newtoken.html file
        writeHtmlFile('newtoken.html', newtokenhtml, 'routes');
        // Write the count.html file
        writeHtmlFile('count.html', counthtml, 'routes');


} catch (error) {
    
        // If there is an error, log it
        console.error(error);
        myEmitter.emit('log', 'init.createFiles()', 'ERROR', error);
}
    }, 100);
}


/* --------------------------------------------------- */
/*                   writeTxtFile()                    */
/* --------------------------------------------------- */
/*   Function that checks if .txt file exists, and     */
/*         if it doesn't exist it creates it.          */
/* --------------------------------------------------- */
/* --------------------------------------------------- */





async function writeTxtFile(fileName, data) {

    if (DEBUG) console.log(`Calling init.writeFile(${fileName})`);
    myEmitter.emit('log', 'init.createFiles().writeFile()', 'INFO', `Calling init.writeFile(${fileName})`)

    const filePath = path.join(__dirname, 'views', fileName);

    try {

        // Check if the file exists
        await fsPromises.access(filePath);
        console.log(`File ${fileName} already exists.`);
        myEmitter.emit('log', 'init.createFiles().writeFile()', 'INFO', `File ${fileName} already exists.`)

    } catch (error) { // If theres an error then the file does not exist so we create it

        if (error.code === 'ENOENT') {
            // File does not exist, create it
            try {

                await fsPromises.writeFile(filePath, data);
                console.log(`File ${fileName} written successfully.`);
                myEmitter.emit('log', 'init.createFiles().writeFile()', 'INFO', `File ${fileName} written successfully.`)

            } catch (writeError) {
                // If there is an error writing the file, log it
                console.error(`Error creating file ${fileName}:`, writeError);
                myEmitter.emit('log', 'init.createFiles().writeFile()', 'ERROR', `Error creating file ${fileName}: ${writeError}`)
            }

        } else {
            // If there is an error accessing the file, log it
            console.error(`Error accessing the file ${fileName}:`, error);
            myEmitter.emit('log', 'init.createFiles().writeFile()', 'ERROR', `Error accessing the file ${fileName}: ${error}`)
        }
    }
} // End of writeTxtFile()



/* --------------------------------------------------- */
/*                   writeJsonFile()                   */
/* --------------------------------------------------- */
/*   Function that checks if .json file exists, and    */
/*   if it doesn't exist it creates it. It takes two   */
/*   paramaters 1: fileName, 2: data. The file that    */
/*   it checks for depends on the fileName arg given,  */
/*   and it is able to write the file using the data   */
/*   arg.                                              */
/* --------------------------------------------------- */
/* --------------------------------------------------- */

function writeJsonFile(fileName, data) {

    let filePath = path.join(__dirname, '/json/', fileName)
    let jsonData = JSON.stringify(data, null, 2)

    // Check to see if the config.json file does not already exist
    if (!fs.existsSync(filePath)) {

        // Check to see if the json folder exists first
        if (!fs.existsSync(path.join(__dirname, './json'))) {

            // If it does not exist, create it
            fsPromises.mkdir(path.join(__dirname, './json'))
        }

        fs.writeFile('./json/'+ fileName, jsonData, (error) => {

            // Deal with any errors
            if (error) {
                console.error(error);
                myEmitter.emit('log', 'init.createFiles()', 'ERROR', error);
            
            // If no errors, log the success
            } else {

                if (DEBUG) console.log(`${fileName} file written successfully`);
                myEmitter.emit('log', 'init.createFiles()', 'INFO', `${fileName} file written successfully`);

            }
        })

    } else { // Else the config.json file aready exists

        if (DEBUG) console.log(`${fileName} file already exists.`);
        myEmitter.emit('log', 'init.createFiles()', 'INFO', `${fileName} file already exists.`);
    }
} // End of writeJsonFile()


/* --------------------------------------------------- */
/*                   writeHtmlFile()                   */
/* --------------------------------------------------- */
/*   Function that checks if .html file exists, and    */
/*   if it doesn't exist it creates it. It takes two   */
/*   paramaters 1: fileName, 2: content. The file      */
/*   that it checks for depends on the fileName arg    */
/*   given, and it is able to write the file using     */
/*   the content arg.                                  */
/* --------------------------------------------------- */
/* --------------------------------------------------- */

async function writeHtmlFile(fileName, content, folderName) {
    // Specify the folder path for "routes" folder or any other folder
    const folderPath = path.join(__dirname, folderName);
    const filePath = path.join(folderPath, fileName);

    try {
        // Check to see if the HTML file does not already exist
        if (!fs.existsSync(filePath)) {
            // Check to see if the folder exists first
            if (!fs.existsSync(folderPath)) {
                // If it does not exist, create it
                fsPromises.mkdir(folderPath);
            }

            await fsPromises.writeFile(filePath, content);
            console.log(`File ${fileName} written successfully.`);
            myEmitter.emit('log', 'init.createFiles().writeHtmlFile()', 'INFO', `File ${fileName} written successfully.`);
        } else {
            console.log(`${fileName} file already exists.`);
            myEmitter.emit('log', 'init.createFiles().writeHtmlFile()', 'INFO', `${fileName} file already exists.`);
        }
    } catch (error) {
        console.error(`Error writing file ${fileName}:`, error);
        myEmitter.emit('log', 'init.createFiles().writeHtmlFile()', 'ERROR', `Error writing file ${fileName}: ${error}`);
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
            myEmitter.emit('log', 'init --all', 'INFO', 'Create all folders and files.');

            createFolders();
            createFiles();

            break;

        case '--cat':

            if (DEBUG) console.log(`${myArgs[1]} --> createFiles()`);
            myEmitter.emit('log', myArgs, 'INFO', 'Create all files.')

            // First call createFolders() to make sure all folders already exist
            // createFolders();
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
                
                console.log('node myapp init --help --> Display the init.txt help file.')
                console.log(data.toString()); // If no errors, display the data from the file

                }
            })
    }
}

module.exports = { 
    initApp,
    writeJsonFile,
};
