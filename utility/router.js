const { handleLogin, handleRegister } = require('../utility/handleAuth');
const {handlePassword} = require("./handleAuth");
const {handleFileUpload, handleImageUpload, handleImageAndThumbnail} = require("./handleFile");
const {raw} = require("mysql2");
const handleGmail = require("./handleMail"); // Import login handler

// Routing logic for handling different routes
const handleRoutes = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content for preflight
        res.end();
        return;
    }

    const { method, url } = req; // Destructure method and URL

    switch (method) {
        // Handle GET requests
        case 'GET':
            switch (url) {
                case '/':
                    res.writeHead(200);
                    res.end(JSON.stringify({ message: 'Welcome to my Node.js server with config.ini!' }));
                    break;

                case '/api':
                    res.writeHead(200);
                    res.end(JSON.stringify({
                        message: 'This is the API route',
                        data: { name: 'Spencer', role: 'Backend Developer' }
                    }));
                    break;
                default:
                    res.writeHead(404);
                    res.end(JSON.stringify({ message: 'Route not found' }));
                    break;
            }
            break;

        // Handle POST requests
        case 'POST':
            if (url === '/auth/register') {
                let body = '';

                // Listen for incoming data chunks
                req.on('data', chunk => {
                    body += chunk.toString(); // Convert binary data to a string
                });

                // When all data has been received
                req.on('end', async () => {
                    await handleRegister(body, res);
                });
            }else if (url === '/auth/login') {
                let body = '';

                // Listen for incoming data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // When all data is received
                req.on('end', async () => {
                    await handleLogin(body, res);
                });
            }else if (url === '/auth/resetPassword') {
                let body = '';

                // Listen for incoming data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // When all data is received
                req.on('end', async () => {
                    await handlePassword(body, res);
                });
            }else if(url === '/upload') {
                handleFileUpload(req, res);
            }else if(url === '/uploadImage') {
                handleImageUpload(req, res);
            }else if(url === '/uploadImageThumbnail') {
                handleImageAndThumbnail(req, res);
            }else if(url === '/sendMail') {
                let body = '';

                // Listen for incoming data
                req.on('data', chunk => {
                    body += chunk.toString();
                });

                // When all data is received
                req.on('end', async () => {
                    await handleGmail(body, res);
                });
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Route not found' }));
            }
            break;

        // Handle unsupported methods
        default:
            res.writeHead(405);
            res.end(JSON.stringify({ message: 'Method not allowed' }));
            break;
    }
};

module.exports = handleRoutes;