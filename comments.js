// Create web server 
// 1. Create a web server
// 2. Set up a route
// 3. Get the comments from the comments.json file
// 4. Send the comments back to the client
// 5. Listen to the port 3000

// 1. Create a web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
    // 2. Set up a route
    const urlObj = url.parse(req.url, true);
    const pathname = urlObj.pathname;
    if (pathname === '/comments') {
        if (req.method === 'GET') {
            // 3. Get the comments from the comments.json file
            fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('File not found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(data);
                }
            });
        }

        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
                    if (err) {
                        res.writeHead(404, { 'Content-Type': 'text/plain' });
                        res.end('File not found');
                    } else {
                        const comments = JSON.parse(data);
                        const newComment = JSON.parse(body);
                        comments.push(newComment);
                        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), err => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Internal server error');
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/plain' });
                                res.end('Comment added');
                            }
                        });
                    }
                });
            });
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
    }
});

// 5. Listen to the