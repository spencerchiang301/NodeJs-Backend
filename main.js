const http = require('http');
const fs = require('fs');
const ini = require('ini');

const handleRoutes = require('./utility/router'); // Import routes

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));
const PORT = config.server.port || 3000;
const HOST = config.server.host || 'localhost';

const server = http.createServer(handleRoutes);

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});