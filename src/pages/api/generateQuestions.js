/* eslint-disable import/no-anonymous-default-export */
import { connectToDB } from '../../lib/db';
import { generateTriviaQuestions } from '../../scripts/generate-questions';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { topic, uuid } = req.body;

  // Basic input validation
  if (!topic || !uuid) {
    return res.status(400).json({ error: 'Topic and UUID are required.' });
  }

  try {
    const questions = await generateTriviaQuestions(topic);

    const db = await connectToDB();
    const questionsCollection = db.collection('questions');

    // Remove any existing questions for the given UUID
    await questionsCollection.deleteOne({ uuid });

    // Insert the new questions
    await questionsCollection.insertOne({ 
      uuid, 
      questions, 
      createdAt: new Date(), 
      topic 
    });

    const topicsCollection = db.collection('topics');
    await topicsCollection.insertOne({
      uuid,
      topicName: topic,
      createdAt: new Date()
    });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};
