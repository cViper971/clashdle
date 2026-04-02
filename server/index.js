import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const client = await MongoClient.connect(process.env.MONGO_URI);
const db = client.db('clashdle');
const collection = db.collection('victories');

app.get('/api/victories', async (req, res) => {
    const doc = await collection.findOne({});
    res.json({ victories: doc ? doc.count : 0 });
});

app.post('/api/victories', async (req, res) => {
    const result = await collection.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: 'after' }
    );
    res.json({ victories: result.count });
});

app.listen(3001, () => console.log('Server running on port 3001'));