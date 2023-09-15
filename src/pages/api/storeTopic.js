import { v4 as uuidv4 } from 'uuid';
import { connectToDB } from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { topic } = req.body;

    // Basic input validation
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const db = await connectToDB();
    const topicsCollection = db.collection('topics');

    const topicUUID = `${uuidv4()}-${Date.now()}`;
    try {
      await topicsCollection.insertOne({
        uuid: topicUUID,
        topicName: topic,
        createdAt: new Date()
      });
      return res.status(200).json({ uuid: topicUUID });
    } catch (error) {
      console.error('Failed to store topic in the database:', error);
      return res.status(500).json({ error: 'Failed to store topic in the database.' });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
