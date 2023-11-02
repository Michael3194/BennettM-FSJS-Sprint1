global.DEBUG = true;

const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const { newToken, tokenCount } = require('./token.js');

const server = http.createServer(async (req, res) => {
    let path = './routes/';

    switch (req.url) {
        case '/':
            path += 'index.html';
            res.statusCode = 200;
            fetchFile(path);
            break;

        case '/new':
            if (req.method === 'POST') {
                collectRequestData(req, (result) => {
                    let theToken = newToken(result.username);
                    res.write(`
                        <!doctype html>
                        <html>
                        <body>
                            ${result.username} token is ${theToken} <br />
                            <a href="http://localhost:3000">[home]</a>
                        </body>
                        </html>
                    `);
                    res.end();
                });
            } else {
                path += 'newtoken.html';
                res.statusCode = 200;
                fetchFile(path);
            }
            break;

        case '/count':
            tokenCount()
                .then((theCount) => {
                    res.end(`
                        <!doctype html>
                        <html>
                        <body>
                            Token count is ${theCount} <br />
                            <a href="http://localhost:3000">[home]</a>
                        </body>
                        </html>
                    `);
                })
                .catch((error) => {
                    console.error(error);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                });
            break;

        default:
            break;
    }

    function fetchFile(path) {
        fs.readFile(path, function (err, data) {
            if (err) {
                console.log(err);
                res.end();
            } else {
                if (DEBUG) console.log('File was served');
                res.writeHead(res.statusCode, { 'Content-Type': 'text/html' });
                res.write(data);
                res.end();
            }
        });
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000')
})

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if (request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', (chunk) => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    } else {
        callback(null);
    }
}
