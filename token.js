// File: token.js
// File Created: 2023-10-27
// Author: Michael Bennett


/* --------------------------------------------------- */
/*              Load all needed modules                */
/* --------------------------------------------------- */

const logEvents = require('./logEvents.js'); // Load our logEvents file to use the logEvents()
const { tokenjson } = require('./templates.js');
const { writeJsonFile } = require('./init.js');

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
    return fsPromises.readFile(path.join(__dirname, 'json/token.json'), 'utf8')
        .then((data) => {
            // Parse the JSON data
            const tokenData = JSON.parse(data);

            // Display the number of tokens
            const count = tokenData.length;
            console.log(`Number of tokens: ${count}`);
            myEmitter.emit('log', 'INFO', 'token.tokenCount()', `Number of tokens: ${count}`);

            return count;
        })
        .catch((error) => {
            myEmitter.emit('log', 'ERROR', 'tokenCount()', error);
            console.error(error);
            throw error; // Rethrow the error if needed
        });
}// End of tokenCount()


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

        myEmitter.emit('log', 'INFO', 'token.tokenList()', 'Tokens displayed to the console successfully.');

    })


    .catch((error) => {
        
        console.error(error);
        myEmitter.emit('log', 'ERROR', 'token.tokenList()', error);
    })

} // End of tokenList()


/* --------------------------------------------------- */
/*                    newToken()                      */
/* --------------------------------------------------- */
/*     This function generates a new token and         */
/*      adds it to the token.json file.                */
/* --------------------------------------------------- */
/* --------------------------------------------------- */


function newToken(username) {
    if (DEBUG) console.log(`token.newToken() --> Generate a new token for username: "${username}"`);
    myEmitter.emit('log', 'INFO', 'token.newToken()', `[--new] [${username}] --> Generate a new token for username: "${username}"`);

    const newToken = tokenjson[0]; // Grab the first object from the template tokenjson array

    let now = new Date(); // Get the current date and time
    let expires = addDays(now, 3); // Add 3 days to the current date and time

    // Set the newToken object properties
    newToken.created = `${format(now, 'yyyy-MM-dd HH:mm:ss')}`;
    newToken.username = username;
    newToken.token = crc32(username).toString(16);
    newToken.expires = `${format(expires, 'yyyy-MM-dd HH:mm:ss')}`;

    fs.readFile(path.join(__dirname, 'json/token.json'), 'utf8', (error, data) => {

        if (error) { // If there is an error, display it in the console and log it to the log file
            
            myEmitter.emit('log', 'ERROR', 'token.newToken()', error);
            console.error('Error reading token.json file. Make sure the file exists. Run: node myapp init --all');

        } else { // No errors, continue

            myEmitter.emit('log', 'INFO', 'token.newToken()', 'The token.json file was read successfully.');

            // Parse the JSON data so that we can loop through it
            let tokens = JSON.parse(data);

            // Loop through the tokens in the token.json file
            
            for (let i = 0; i < tokens.length; i++) {

                // Check if the username already exists in the token.json file
                if (tokens[i]. username === username) {

                    console.log(`The username ${username} already exists in the token.json file.`);
                    myEmitter.emit('log', 'INFO', 'token.newToken()', `The username ${username} already exists in the token.json file.`);

                    // If the username already in the token.json file, return out of the function
                    return;
                }
            }

            // If the username is not already in the token.json file, then continue
            
            tokens.push(newToken); // Add the newToken object to the tokens array

            // Convert the tokens array to JSON so that we can write it to the token.json file
            let userTokens = JSON.stringify(tokens, null, 2);
             

            // Write userTokens to the token.json file
            fs.writeFile(path.join(__dirname, 'json/token.json'), userTokens, (error) => {

                if (error) { // If there is an error, display it in the console and log it to the log file

                    myEmitter.emit('log', 'ERROR', 'token.newToken()', error);
                    console.error(error);

                } else { // If no errors, display a success message in the console and log it to the log file

                    myEmitter.emit('log', 'INFO', 'token.newToken()', `A new token was generated for username: "${username}"`);
                    myEmitter.emit('log', 'INFO', 'token.newToken()', 'The token was added to the token.json file successfully.');

                    console.log('The token.json file was updated successfully.');
                }
            });
        } 
    });

    // Return the new token number so we can use it in the web part of the app
    return newToken.token;

} // End of newToken()


/* --------------------------------------------------- */
/*                   updateToken()                     */
/* --------------------------------------------------- */
/*     This function updates the token.json file       */
/*      phone number or email address for a user       */
/*       depending on the command line arguments       */
/*     "node myapp token --upd [p or e] [username]     */
/*        [value]" p updates phone number and e        */
/*               updates email address                 */
/* --------------------------------------------------- */
/* --------------------------------------------------- */


function updateToken(myArgs) {

    if (DEBUG) console.log('token.updateToken()');
    myEmitter.emit('log', 'INFO', 'token.updateToken()', 'Calling updateToken()');

    // Read the token.json file
    fs.readFile(path.join(__dirname, 'json/token.json'), 'utf8', (error, data) => {

        if (error) {

            myEmitter.emit('log', 'ERROR', 'token.updateToken()', 'Error reading the token.json file. Make sure the file exists. Run: node myapp init --all');
            console.error('Error reading the token.json file. Make sure the file exists. Run: node myapp init --all');
        } else {

            let tokens = JSON.parse(data); // Parse the JSON data so that we can loop through it

            let found = false; // Set found to false

            // Loop through the tokens in the token.json file
            tokens.forEach((token) => {

                if (token.username === myArgs[3]) {
                    found = true; // If the username is found, set found to true
                    switch (myArgs[2]) {

                        case 'p': // Update phone number
                        case 'P':

                            if (DEBUG) console.log('token.updateToken() [p] --> Update phone number for username: ', myArgs[3]);

                            myEmitter.emit('log', 'INFO', 'token.updateToken()', `[--upd] [p] [${myArgs[3]}] [${myArgs[4]}] --> Update phone number`);
                            
                            token.phone = myArgs[4];
                            break;
                        
                        case 'e': // Update email address
                        case 'E':

                            if (DEBUG) console.log('token.updateToken() [e] --> Update email address');

                            myEmitter.emit('log', 'INFO', 'token.updateToken()', `[--upd] [e] [${myArgs[3]}] [${myArgs[4]}] --> Update email address`);
                            token.email = myArgs[4];
                            break;
                        
                        default: // Incorrect option entered

                            console.log('Incorrect option entered. Try: node myapp token --upd [p or e] [username] [value]');
                            myEmitter.emit('log', 'ERROR', 'token.updateToken()', 'Incorrect option entered. Try: node myapp token --upd [p or e] [username] [value]');

                    }
                }
            });

            if (!found) {
                    
                    console.log(`The username ${myArgs[3]} was not found in the token.json file.`);
                    myEmitter.emit('log', 'INFO', 'token.updateToken()', `The username ${myArgs[3]} was not found in the token.json file.`);
                    return;

            } else {

            // Convert the tokens array to JSON so that we can write it to the token.json file
            userTokens = JSON.stringify(tokens, null, 2);

            // Write userTokens to the token.json file
            fs.writeFile(path.join(__dirname, 'json/token.json'), userTokens, (error) => {

                if (error) { // If there is an error, display it in the console and log it to the log file
                        
                        myEmitter.emit('log', 'ERROR', 'token.updateToken()', error);
                        console.error(error);

                } else { // If no errors, display a success message in the console and log it to the log file

                    myEmitter.emit('log', 'INFO', 'token.updateToken()', `Token record for username: ${myArgs[3]} was updated with ${myArgs[2]}: ${myArgs[4]}`);
                    console.log(`Token record for username: ${myArgs[3]} was updated with ${myArgs[2]}: ${myArgs[4]}`);
                }
            })
            }
        }
    })
} // End of updateToken()


function searchToken(myArgs) {

    if (DEBUG) console.log('token.searchToken()');

    myEmitter.emit('log', 'INFO', 'token.searchToken()', 'Calling searchToken()');

    if (myArgs.length < 4) {
            
            console.log('Invalid syntax. Try: node myapp token --search [username]');
            myEmitter.emit('log', 'ERROR', 'token.searchToken()', 'Invalid syntax. Try: node myapp token --search [u,e or p] [username, email or phone number]');

            return;
    }

    // Read the token.json file
    fs.readFile(path.join(__dirname, 'json/token.json'), 'utf8', (error, data) => {

        if (error) {
                
            console.error(error);
            myEmitter.emit('log', 'ERROR', 'token.searchToken()', error);
                
        } else {

            let tokens = JSON.parse(data); // Parse the JSON data

            let found = false; // Set found to false

            // Loop through the tokens in the token.json file
            tokens.forEach((token) => {

                switch (myArgs[2]) {

                    case 'u': // Search for username
                        if (token.username === myArgs[3]) {

                            myEmitter.emit('log', 'INFO', 'token.searchToken()', `Token found for username: ${myArgs[3]}`);
                            found = true; // If the username is found, set found to true

                            displayToken(token);
                        }
                        break;
                    
                    case 'e': // Search for email address
                        if (token.email === myArgs[3]) {

                            myEmitter.emit('log', 'INFO', 'token.searchToken()', `Token found for email address: ${myArgs[3]}`);
                            found = true; // If the email address is found, set found to true

                            displayToken(token);
                        }
                        break;

                    case 'p': // Search for phone number
                        if (token.phone === myArgs[3]) {
                            myEmitter.emit('log', 'INFO', 'token.searchToken()', `Token found for phone number: ${myArgs[3]}`);

                            found = true; // If the phone number is found, set found to true

                            displayToken(token);
                        }
                        break;

                    default: // Incorrect option entered
                        
                        console.log('Incorrect option entered. Try: node myapp token --search [u,e or p] [username, email or phone number]');

                        myEmitter.emit('log', 'ERROR', 'token.searchToken()', 'Incorrect option entered. Try: node myapp token --search [u,e or p] [username, email or phone number]');

                }
            });

            if (!found) {

                console.log(`The ${myArgs[2]}: ${myArgs[3]} was not found in the token.json file.`);
                myEmitter.emit('log', 'INFO', 'token.searchToken()', `The ${myArgs[2]}: ${myArgs[3]} was not found in the token.json file.`);
            
            }
        }
    })
}

function displayToken(token) {

    if (DEBUG) console.log('token.displayToken()');
    myEmitter.emit('log', 'INFO', 'token.displayToken()', `Displayed token for username: ${token.username} successfully.`);

    console.log(`Token found:`)
    console.log(JSON.stringify(token, null, 2));

    return token;
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

        // Display the number of tokens in the token.json file
        case '--count':

            myEmitter.emit('log', 'INFO', 'token.tokenApp()', 'Calling token.tokenApp() --count');
            if (DEBUG) console.log('token.tokenApp() --count');
            tokenCount();
            break;
        
        // Display the tokens in the token.json file
        case '--list':
            myEmitter.emit('log', 'INFO', 'token.tokenApp()', 'Calling token.tokenApp() --list');
            if (DEBUG) console.log('token.tokenApp() --list');
            tokenList();
            break;

        // Generate a new token based on the username entered
        case '--new':
            if (myArgs.length < 3) {
                
                console.log('Invalid syntax. Try: node myapp token --new [username]');
                myEmitter.emit('log', 'ERROR', 'token.tokenApp()', 'Invalid syntax. Try: node myapp token --new [username]');

            } else {
                myEmitter.emit('log', 'INFO', 'token.tokenApp()', `Calling token.tokenApp() --new [${myArgs[2]}]`);

                if (DEBUG) console.log('token.tokenApp() --new');
                newToken(myArgs[2]);
            }
            break;

        case '--upd':
            if (DEBUG) console.log('token.tokenApp() --upd');
            myEmitter.emit('log', 'INFO', 'token.tokenApp()', 'Calling token.tokenApp() --upd');

            if (myArgs.length < 5) {
                console.log('Invalid syntax. Try: node myapp token --upd [option] [username] [value]');
                myEmitter.emit('log', 'ERROR', 'token.tokenApp() --upd', 'Invalid syntax. Try: node myapp token --upd [option] [username] [value]');
            } else {

                updateToken(myArgs);
            }

            break;

        case '--search':
            if (DEBUG) console.log('token.tokenApp() --search');
            searchToken(myArgs);
            break;

        case '--help':
        case '--h':
        default:

            if (DEBUG) console.log('token.tokenApp() --help');

            myEmitter.emit('log', 'INFO', 'token.tokenApp()', 'Display the usage.txt file.');

            // Read the token.txt file
            fs.readFile(path.join(__dirname + 'views/token.txt'), 'utf8', (error, data) => {

                if (error) {
                    // Error reading the token.txt file
                    myEmitter.emit('log', 'ERROR', 'token.tokenApp()', error);
                    console.error(error);

                } else {
                    // Display the token.txt file
                    console.log(data.toString());
                }
            })
    }
} // End of tokenApp()


/* --------------------------------------------------- */
/*                      addDays()                      */
/* --------------------------------------------------- */
/*       This function adds a number of days to        */
/*                        a date                       */
/* --------------------------------------------------- */
/* --------------------------------------------------- */

function addDays(date, days) {

    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

module.exports = { 
    tokenApp,
    newToken,
    tokenCount
};