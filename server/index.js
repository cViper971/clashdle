import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

const client = await MongoClient.connect(process.env.MONGO_URI);
const db = client.db('clashdle');
const collection = db.collection('victories');
const users = db.collection('users');

function requireAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not logged in' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

app.get('/api/me', requireAuth, (req, res) => {
    res.json({ username: req.user.username });
});

app.get('/api/victories', requireAuth, async (req, res) => {
    const doc = await collection.findOne({});
    res.json({ victories: doc ? doc.count : 0 });
});

app.post('/api/victories', requireAuth, async (req, res) => {
    const result = await collection.findOneAndUpdate(
        {},
        { $inc: { count: 1 } },
        { upsert: true, returnDocument: 'after' }
    );
    res.json({ victories: result.count });
});

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const existing = await users.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    const hash = await bcrypt.hash(password, 10);
    const result = await users.insertOne({ username, password: hash });

    const token = jwt.sign({ userId: result.insertedId, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ username });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await users.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ userId: user._id, username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 24 * 60 * 60 * 1000 });
    res.json({ username });
});

app.listen(3001, () => console.log('Server running on port 3001'));