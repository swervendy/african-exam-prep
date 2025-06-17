import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../utils/dbConnect';

export default async function storeStepByStepMessage(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await dbConnect()
  const { sessionID, role, content, sender } = req.body

  // Split the content into an array of strings based on '\n\n'
  const contentArray = content;
  
  try {
    // Insert the message into the StepByStepMessages collection
    await db.collection('StepByStepMessages').insertOne({ sessionID, role, content: contentArray, sender })
    res.status(200).json({ message: 'Message stored successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}