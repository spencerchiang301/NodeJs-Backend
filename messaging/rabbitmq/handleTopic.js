const myRabbitMQConnection = require("./rabbitmq");
const {receiveFromExchangeRouting} = require("./handleQueue");

async function sendToTopicExchange() {
    let connection, channel;

    try {
        // Establish a new connection to RabbitMQ
        const connection = await myRabbitMQConnection;
        channel = await connection.createChannel();

        const exchange = 'topic_logs';
        await channel.assertExchange(exchange, 'topic', { durable: false });

        // Define routing keys and messages
        const messages = [
            { key: 'user.signup', message: 'User signed up successfully' },
            { key: 'user.login', message: 'User logged in successfully' },
            { key: 'order.created', message: 'Order created successfully' },
            { key: 'order.shipped', message: 'Order shipped to customer' }
        ];

        // Send messages to the topic exchange with different routing keys
        for (const msg of messages) {
            const isSent = channel.publish(exchange, msg.key, Buffer.from(msg.message));
            console.log(`Sent ${msg.key}: '${msg.message}'`);

            // Wait for the 'drain' event if messages aren't sent immediately
            if (!isSent) {
                await new Promise(resolve => channel.once('drain', resolve));
            }
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Ensure the channel and connection are properly closed
        if (channel) {
            await channel.close();
            console.log('Channel closed.');
        }

        if (connection) {
            await connection.close();
            console.log('Connection closed.');
        }
    }
}


async function receiveTopicExchange1(req, res) {
    try {
        const connection = await myRabbitMQConnection;
        const channel = await connection.createChannel();

        const exchange = 'topic_logs';
        await channel.assertExchange(exchange, 'topic', { durable: false });

        const q = await channel.assertQueue('', { exclusive: true });

        // Bind the queue to the exchange with the pattern 'user.#' to receive all user-related messages
        await channel.bindQueue(q.queue, exchange, 'user.#');

        res.write('Waiting for user-related messages...');

        await channel.consume(q.queue, (msg) => {
            console.log(`Received ${msg.fields.routingKey}: '${msg.content.toString()}'`);
        }, { noAck: true });

    } catch (error) {
        console.error('Error:', error);
    }
}

async function receiveTopicExchange2(req, res) {
    try {
        const connection = await myRabbitMQConnection;
        const channel = await connection.createChannel();

        const exchange = 'topic_logs';
        await channel.assertExchange(exchange, 'topic', { durable: false });

        const q = await channel.assertQueue('', { exclusive: true });

        // Bind the queue to the exchange with the pattern 'user.#' to receive all user-related messages
        await channel.bindQueue(q.queue, exchange, 'order.#');

        res.write('Waiting for user-related messages...');

        await channel.consume(q.queue, (msg) => {
            console.log(`Received ${msg.fields.routingKey}: '${msg.content.toString()}'`);
        }, { noAck: true });

    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    sendToTopicExchange,
    receiveTopicExchange1,
    receiveTopicExchange2,
}