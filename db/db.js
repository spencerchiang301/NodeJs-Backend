const mysql = require('mysql2');
const fs = require('fs');
const ini = require('ini');

const config = ini.parse(fs.readFileSync('./config/config.ini', 'utf-8'));
const HOST = config.db.host;
const PORT = config.db.port;
const USER = config.db.user;
const PASSWORD = config.db.password;
const DATABASE = config.db.database;

const myConnection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: PORT,
});


module.exports = myConnection;