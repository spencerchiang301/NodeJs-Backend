const { Kafka } = require('kafkajs');
const ini = require('ini');
const path = require("path");
const fs = require("fs");

const configFilePath = path.resolve(__dirname, '../../config/config.ini');
const config = ini.parse(fs.readFileSync(configFilePath, 'utf-8'));
const clientIP = config.kafka.clientIP;
const broker1 = config.kafka.brokers_1;
const broker2 = config.kafka.brokers_2;
const broker3 = config.kafka.brokers_3;

// Initialize a new Kafka instance
const myKafkaConnection = new Kafka({
    clientId: `${clientIP}`,
    brokers: [`${broker1}`,`${broker2}`,`${broker3}`], // List of Kafka brokers
});

module.exports = myKafkaConnection;