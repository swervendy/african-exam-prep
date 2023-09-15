import { connectToDB } from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { sessionID } = req.query;

    try {
      const dbConnection = await connectToDB();
      console.log('dbConnection:', dbConnection); // Add this line
      const collection = dbConnection.collection('quizSessions');

      // Retrieve the quiz session with the user's answers
      const session = await collection.findOne({ sessionID: sessionID });

      if (session) {
        console.log('getUserAnswers response:', session);
        res.status(200).json(session);
      } else {
        console.error('Failed to get user answers. Session not found:', sessionID);
        res.status(404).json({ error: 'Failed to get user answers. Session not found.' });
      }
    } catch (error) {
      console.error('Error getting user answers:', error);
      res.status(500).json({ error: 'Error getting user answers: ' + error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed. Please use GET.' });
  }
}