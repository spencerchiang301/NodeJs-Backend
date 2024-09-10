const fs = require('fs');
const path = require('path');
const ini = require('ini');
const { MongoClient } = require('mongodb');

const configFilePath = path.resolve(__dirname, '../../config/config.ini');
const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'));
const HOST = config.mongoDB.host;
const PORT = config.mongoDB.port;
const USER = config.mongoDB.user;
const PASSWORD = config.mongoDB.password;
const DATABASE = config.mongoDB.database;
const COLLECTION = config.mongoDB.collection;

// example uri = mongodb://<username>:<password>@localhost:27017/myDatabase
const myMongoConnection = new MongoClient(
    `mongodb://${HOST}:${PORT}`,
);

module.exports = myMongoConnection;