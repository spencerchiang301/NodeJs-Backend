const { handleLogin, handleRegister } = require('../utility/handleAuth');
const {handlePassword} = require("./handleAuth");
const {handleFileUpload, handleImageUpload} = require("./handleFile");
const handleGmail = require("./handleMail");
const {mongoFindData, mongoInsertData} = require("../db/mongo/mongoConn");
const {sendMessageToQueue, readMessageFromQueue} = require("../messaging/rabbitmq/handleQueue");
const {sendToExchangeRouting, receiveFromExchangeRouting} = require("../messaging/rabbitmq/handleRouting");
const {receiveTopicExchange2, receiveTopicExchange1, sendToTopicExchange} = require("../messaging/rabbitmq/handleTopic");
const {sendTopic, receiveTopic} = require("../messaging/kafka/handleTopicKafka");

// Routing logic for handling different routes
const handleRoutes = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9900');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content for preflight
        res.end();
        return;
    }

    const {method, url} = req; // Destructure method and URL

    switch (method) {
        // Handle GET requests
        case 'GET':
            switch (url) {
                case '/':
                    res.writeHead(200);
                    res.end(JSON.stringify({message: 'Welcome to my Node.js server with config.ini!'}));
                    break;
                case '/mongo/selectData':
                    await mongoFindData(req, res);
                    break;
                case '/mongo/insertData':
                    await mongoInsertData(req, res);
                    break;
                default:
                    res.writeHead(404);
                    res.end(JSON.stringify({message: 'Route not found'}));
                    break;
            }
            break;

        case 'POST':
            switch (url) {
                case '/auth/register':
                    await handleRegister(req, res);
                    break;
                case '/auth/login':
                    await handleLogin(req, res);
                    break;
                case '/auth/resetPassword':
                    await handlePassword(req, res)
                    break;
                case '/file/upload':
                    handleFileUpload(req, res);
                    break;
                case '/file/uploadImage':
                    handleImageUpload(req, res);
                    break;
                case '/mail/sendMail':
                    await handleGmail(req, res);
                    break;
                case '/rabbit/send':
                    await sendMessageToQueue(req, res);
                    break;
                case '/rabbit/read':
                    await readMessageFromQueue(req, res);
                    break;
                case '/rabbit/sendExchange':
                    await sendToExchangeRouting(req, res);
                    break
                case '/rabbit/receiveExchange':
                    await receiveFromExchangeRouting(req, res);
                    break
                case '/rabbit/sendTopicExchange':
                    await sendToTopicExchange(req, res);
                    break
                case '/rabbit/receiveTopicExchange1':
                    await receiveTopicExchange1(req, res);
                    break
                case '/rabbit/receiveTopicExchange2':
                    await receiveTopicExchange2(req, res);
                    break
                case '/kafka/sendTopic':
                    await sendTopic(req, res);
                    break
                case '/kafka/receiveTopic':
                    await receiveTopic(req, res);
                    break
                default:
                    res.writeHead(405);
                    res.end(JSON.stringify({message: 'Method not allowed'}));
                    break;
            }
            break;
    }
};

module.exports = handleRoutes;