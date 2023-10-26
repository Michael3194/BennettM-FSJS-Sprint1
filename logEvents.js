// File Created: 2023-10-22

/* --- NPM Installed Modules --- */
const { format, getYear } = require('date-fns'); // Used to format the date and time.
const { v4: uuidv4 } = require('uuid'); // Used to generate a unique ID.


/* --- NodeJS Common Core Modules --- */
const fs = require('fs'); // Used to read and write files.
const fsPromises = require('fs').promises; // Provides promise based file systems functions.
const path = require('path'); // Used to work with file and directory paths.

const logEvents = async (event, level, message) => {

    // Format the date and time to be used in the log file.
    const dateTime = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`;

    // This is the format for each log entry.
    const logItem = `${dateTime}\t${level}\t${event}\t ${message}\t${uuidv4()}`

    try {

        const currentFolder = 'logs/' + getYear(new Date());

        // If 'logs/' directory does not exist.
        if (!fs.existsSync(path.join(__dirname, 'logs/'))) {

            // Create the 'logs/' directory.
            await fsPromises.mkdir(path.join(__dirname, 'logs/'));

            // After 'logs/' directory is created, check to see if the current year directory does not exist.
            if (!fs.existsSync(path.join(__dirname, currentFolder))) {

                // If it does not exist, create it.
                await fsPromises.mkdir(path.join(__dirname, currentFolder));
            }

        } else { // If 'logs/' directory does exist.

            // Check to see if the current year directory does not exist.
            if (!fs.existsSync(path.join(__dirname, currentFolder))) {

                // If it does not exist, create it.
                await fsPromises.mkdir(path.join(__dirname, currentFolder));
            }
        }

        // if (DEBUG) console.log(logItem);
        
        const fileName = `${format(new Date(), 'MMdd')}` + '_events.log';

        // Write the log entry to the log file.
        await fsPromises.appendFile(path.join(__dirname, currentFolder, fileName), logItem + '\n');

    } catch (error) {

        console.error(error);
    }
}

module.exports = logEvents;