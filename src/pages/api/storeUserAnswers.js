import { v4 as uuidv4 } from 'uuid';
import { connectToDB } from '../../lib/db';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { sessionID, userAnswers } = req.body;

    // Basic input validation
    if (!userAnswers) {
      return res.status(400).json({ error: 'userAnswers are required.' });
    }

    const db = await connectToDB();
    const answersCollection = db.collection('quizSessions');

    let newSessionID = sessionID;
    if (!sessionID) {
      newSessionID = `${uuidv4()}-${Date.now()}`;
    }

    try {
      const result = await answersCollection.updateOne(
        { sessionID: newSessionID },
        { $set: { userAnswers: userAnswers } },
        { upsert: true }
      );

      if (result.modifiedCount === 1 || result.upsertedCount === 1) {
        return res.status(200).json({ message: 'User answers stored successfully.', sessionID: newSessionID });
      } else {
        console.error('Failed to store user answers. Session not found:', newSessionID);
        return res.status(404).json({ error: 'Failed to store user answers. Session not found.' });
      }
    } catch (error) {
      console.error('Error storing user answers:', error);
      return res.status(500).json({ error: 'Error storing user answers: ' + error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};
