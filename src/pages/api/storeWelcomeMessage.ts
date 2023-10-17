import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';

export default async function storeMessage(req: NextApiRequest, res: NextApiResponse) {
  const { db, client } = await dbConnect();

  if (req.method === 'POST') {
    const { sessionID, role, content, sender } = req.body;

    try {
      const result = await db.collection('messages').insertOne({
        session_id: sessionID,
        role,
        content,
        timestamp: new Date(),
        sender,
      });

      res.status(200).json({ message: 'Message stored successfully!' });
    } catch (error) {
      console.error('Error storing message:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}