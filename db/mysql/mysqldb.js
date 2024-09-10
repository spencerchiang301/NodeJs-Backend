const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const configFilePath = path.resolve(__dirname, '../../config/config.ini');
const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'));
const HOST = config.mysqlDB.host;
const PORT = config.mysqlDB.port;
const USER = config.mysqlDB.user;
const PASSWORD = config.mysqlDB.password;
const DATABASE = config.mysqlDB.database;

const myConnection = mysql.createConnection({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
    port: PORT,
});


module.exports = myConnection;