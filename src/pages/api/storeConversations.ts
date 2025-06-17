import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';

export default async function storeConversation(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await dbConnect()
  const { sessionID, role, content, sender } = req.body

  try {
    // Insert the message into the Conversations collection
    await db.collection('Conversations').insertOne({ sessionID, role, content, sender, timestamp: new Date() })
    res.status(200).json({ message: 'Message stored successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}