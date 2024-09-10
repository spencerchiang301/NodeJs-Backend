const { MongoClient } = require('mongodb');
const myMongoConnection = require('./mongodb');  // Import your MongoDB configuration

async function mongoInsertData(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    try {
        await myMongoConnection.connect();
        res.write(JSON.stringify({ message: 'Connected to MongoDB' }));

        const db = myMongoConnection.db('user');
        const collection = db.collection('info');

        const insertResult = await collection.insertOne({ name: 'John Doe', age: 30 });
        res.end(JSON.stringify({
            message: 'Document inserted successfully',
            insertedId: insertResult.insertedId
        }));
    } catch (error) {
        res.end(JSON.stringify({
            message: 'Error accessing MongoDB',
            error: error.toString()
        }));
    } finally {
        // Ensure that the client is closed after the operation
        await myMongoConnection.close();
    }
}

async function mongoFindData(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    try {
        // Connect to the MongoDB server
        await myMongoConnection.connect();
        res.write(JSON.stringify({ message: 'Connected to MongoDB' }));

        const db = myMongoConnection.db('user');
        const collection = db.collection('info');

        const documents = await collection.find({}).toArray();
        res.end(JSON.stringify({
            message: 'Document found successfully',
            documents: documents
        }));
    } catch (error) {
        res.end(JSON.stringify({
            message: 'Error accessing MongoDB',
            error: error.toString()
        }));
    } finally {
        await myMongoConnection.close();
    }
}


module.exports = {
    mongoInsertData,
    mongoFindData,
}