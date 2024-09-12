const myRabbitMQConnection = require('./rabbitmq');

async function sendToExchangeRouting(req, res) {
    try {
        // Connect to RabbitMQ
        const connection = await myRabbitMQConnection;
        const channel = await connection.createChannel();

        // Declare an exchange
        const exchange = 'direct_logs';
        await channel.assertExchange(exchange, 'direct', {
            durable: false // Exchange does not persist across server restarts
        });

        // Set routing key and message
        const routingKey = 'info'; // Could be 'info', 'warning', 'error', etc.
        const message = 'Log message: coming from rabbitMQ producer';

        // Publish message to exchange with routing key
        channel.publish(exchange, routingKey, Buffer.from(message));
        console.log(`Sent ${routingKey}: '${message}'`);
        res.end(JSON.stringify({message:"send te exchange closed"}));

        // Close the connection and channel after a short delay
        // Wait for the channel to be drained before closing it
        channel.on('drain', async () => {
            console.log("Channel drained. Closing connection...");
            await channel.close();
            await connection.close();
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function receiveFromExchangeRouting(req, res) {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });

        req.on('end', async () => {
            const parsedBody = JSON.parse(body); // Parse the incoming JSON body
            const routingKey = parsedBody.routingKey || 'warn'; // Get the queue name from the body
            try {
                const connection = await myRabbitMQConnection;
                const channel = await connection.createChannel();

                const exchange = 'direct_logs';
                await channel.assertExchange(exchange, 'direct', { durable: false });

                // Create a queue that will receive messages from the exchange
                const q = await channel.assertQueue('', { exclusive: true }); // Auto-generated, exclusive queue

                res.write(`Waiting for messages in queue: ${q.queue}. Binding to exchange '${exchange}' with routing key '${routingKey}'`);

                // Bind the queue to the exchange with the specified routing key
                await channel.bindQueue(q.queue, exchange, routingKey);

                // Consume messages from the queue
                await channel.consume(q.queue, (msg) => {
                    if (msg !== null) {
                        res.write(`Received: ${msg.content.toString()}`);
                        channel.ack(msg); // Acknowledge the message
                    }
                }, { noAck: false }); // Manual acknowledgment to ensure message reliability

            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        // Respond with a 404 for non-POST requests
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid request method. Only POST is supported.' }));
    }

}

module.exports = {
    sendToExchangeRouting,
    receiveFromExchangeRouting,
};