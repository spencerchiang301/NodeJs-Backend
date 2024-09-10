const fs = require('fs');
const path = require('path');
const ini = require('ini');
const amqp = require('amqplib');

const configFilePath = path.resolve(__dirname, '../config/config.ini');
const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'));
const HOST = config.rabbitMQ.host;
const USER = config.rabbitMQ.user;
const PASSWORD = config.rabbitMQ.password;

// example uri = mongodb://<username>:<password>@localhost:27017/myDatabase
const myRabbitMQConnection = amqp.connect('amqp://user:abc123@localhost');

module.exports = myRabbitMQConnection;