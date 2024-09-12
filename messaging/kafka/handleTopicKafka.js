const myKafkaConnection = require('./kafka');

async function sendTopic(req, res) {
    try {
        const myConnection = await myKafkaConnection;
        const producer = myConnection.producer();

        await producer.connect();

        await producer.send({
            topic: 'test',
            messages: [
                { value: 'Hello KafkaJS user!' },
            ],
        });
        console.log('Producer: Hello KafkaJS user!');
        await producer.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}


async function receiveTopic(req, res) {
    try {
        const myConnection = await myKafkaConnection;
        const consumer = myConnection.consumer({ groupId: 'test-group' });

        await consumer.connect();
        await consumer.subscribe({ topic: 'test', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
            },
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = {
    sendTopic,
    receiveTopic,
}