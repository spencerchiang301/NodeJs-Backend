const amqp = require('amqplib');
const myRabbitMQConnection = require("./rabbitmq");

async function connectRabbitMQ(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
        // Connection string to RabbitMQ (localhost in this case)
        const connection = await myRabbitMQConnection

        // Create a channel
        const channel = await connection.createChannel();

        // Declare a queue
        const queue = 'testQueue';

        // Make sure the queue exists
        await channel.assertQueue(queue, {
            durable: false // This means the queue won't survive a server restart
        });

        // Send a message to the queue
        let message = 'Hello spencer, second time';
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`[x] Sent: ${message}`);

        message = 'Hello spencer, three time';
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`[x] Sent: ${message}`);

        // Consume messages from the queue
        await channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log(`[x] Received: ${msg.content.toString()}`);
                channel.ack(msg); // Acknowledge the message (removes it from the queue)
            }
        });
        res.end("Finished connecting to RabbitMQ...");

    } catch (error) {
        res.end(JSON.stringify({
            message: 'Error connecting to RabbitMQ',
            error: error.toString()
        }));
    }
}

module.exports = connectRabbitMQ;