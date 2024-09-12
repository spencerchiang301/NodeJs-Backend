const fs = require('fs');
const path = require('path');
const ini = require('ini');
const amqp = require('amqplib');

const configFilePath = path.resolve(__dirname, '../../config/config.ini');
const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'));
const HOST = config.rabbitMQ.host;
const USER = config.rabbitMQ.user;
const PASSWORD = config.rabbitMQ.password;

// example uri = amqp://<username>:<password>@host
const myRabbitMQConnection = amqp.connect(`amqp://${USER}:${PASSWORD}@${HOST}`);

module.exports = myRabbitMQConnection;