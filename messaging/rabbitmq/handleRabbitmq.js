const myRabbitMQConnection = require('./rabbitmq');

async function sendMessageToRabbitMQ(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', async () => {
            const parsedBody = JSON.parse(body); // Parse the incoming data

            const message = parsedBody.message || 'No thing coming from the client'; // Get the message from the body

            res.writeHead(200, { 'Content-Type': 'application/json' });

            try {
                // Connection string to RabbitMQ (localhost in this case)
                const connection = await myRabbitMQConnection;

                // Create a channel
                const channel = await connection.createChannel();

                // Declare a queue
                const queue = 'testQueue';

                // Make sure the queue exists
                await channel.assertQueue(queue, {
                    durable: false // This means the queue won't survive a server restart
                });

                // Send the message from the POST request to the queue
                channel.sendToQueue(queue, Buffer.from(message));
                console.log(`[x] Sent: ${message}`);

                res.end(JSON.stringify({ message: 'Message sent to RabbitMQ', sentMessage: message }));
            } catch (error) {
                res.end(JSON.stringify({
                    message: 'Error connecting to RabbitMQ',
                    error: error.toString()
                }));
            }
        });
    } else {
        // Respond with a 404 for non-POST requests
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request method. Only POST is supported.' }));
    }
}

async function readMessageFromRabbitMQ(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', async () => {
            try {
                const parsedBody = JSON.parse(body); // Parse the incoming JSON body
                const queue = parsedBody.queue || 'testQueue'; // Get the queue name from the body

                res.writeHead(200, { 'Content-Type': 'application/json' });

                // Connection string to RabbitMQ (assuming it's handled in myRabbitMQConnection)
                const connection = await myRabbitMQConnection;

                // Create a channel
                const channel = await connection.createChannel();

                // Declare a queue
                await channel.assertQueue(queue, {
                    durable: false // Non-persistent queue
                });

                let messages = [];

                // Consume messages from the queue
                await channel.consume(queue, (msg) => {
                    if (msg !== null) {
                        const message = msg.content.toString();
                        console.log(`[x] Received: ${message}`);
                        messages.push(message); // Collect the messages
                        channel.ack(msg); // Acknowledge the message (removes it from the queue)
                    }
                }, {
                    noAck: false // Ensures manual acknowledgment of messages
                });

                // Give some time to receive multiple messages (optional, based on your use case)
                setTimeout(() => {
                    // Send the response after consuming messages
                    res.end(JSON.stringify({
                        message: 'Messages read from RabbitMQ',
                        receivedMessages: messages
                    }));

                    // Close the channel and connection after processing
                    channel.close();
                    connection.close();
                }, 1000); // Adjust this timeout based on how quickly you expect to receive messages

            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Error connecting to RabbitMQ',
                    error: error.toString()
                }));
            }
        });
    } else {
        // Respond with a 404 for non-POST requests
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request method. Only POST is supported.' }));
    }
}

module.exports = readMessageFromRabbitMQ;

module.exports = {
    sendMessageToRabbitMQ,
    readMessageFromRabbitMQ
};