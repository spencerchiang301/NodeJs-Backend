const myKafkaConnection = require('./kafka');

async function sendTopic(req, res) {
    if (req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', async () => {
            const parsedBody = JSON.parse(body); // Parse the incoming data
            const producerId = parsedBody.producerId;

            res.writeHead(200, {'Content-Type': 'application/json'});
            try {
                const myConnection = await myKafkaConnection;
                const producer = myConnection.producer();

                await producer.connect();

                for (let i = 1; i <= 20000; i++) {
                    await producer.send({
                        topic: 'test-topic',
                        messages: [
                            {value: `Hello KafkaJS user! Message number: ${i}`},
                        ],
                    });
                    console.log(`Message number ${i} from producer ${producerId}`);
                }
                await producer.disconnect();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }else {
        // Respond with a 404 for non-POST requests
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Invalid request method. Only POST is supported.'}));
    }
}

async function receiveTopic(req, res) {
    if (req.method === 'POST') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', async () => {
            const parsedBody = JSON.parse(body); // Parse the incoming data
            const consumerId = parsedBody.consumerId;

            res.writeHead(200, { 'Content-Type': 'application/json' });

            try {
                const myConnection = await myKafkaConnection;
                const consumer = myConnection.consumer({ groupId: 'test-group' });

                await consumer.connect();
                await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

                await consumer.run({
                    eachMessage: async ({ topic, partition, message }) => {
                        console.log(`Consumer ${consumerId}, Partition: ${partition}, Message: ${message.value.toString()}`);
                    },
                });
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }else {
        // Respond with a 404 for non-POST requests
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Invalid request method. Only POST is supported.'}));
    }
}

module.exports = {
    sendTopic,
    receiveTopic,
}