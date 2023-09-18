import { connectToDB } from '../../lib/db';
import { generateTriviaQuestions } from '../../scripts/generate-questions';

export default async (req, res) => {
  console.log('Starting to generate questions...');
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
    console.log('Questions generated successfully');
    const db = await connectToDB();
    console.log('Connected to DB successfully');

    // Insert the new questions
    const questionsCollection = db.collection('questions');
    await questionsCollection.insertOne({ 
      uuid, 
      questions, 
      createdAt: new Date(), 
      topic 
    });
    console.log('Questions inserted into DB successfully');

    // Insert the topic
    const topicsCollection = db.collection('topics');
    await topicsCollection.insertOne({
      uuid,
      topicName: topic,
      createdAt: new Date()
    });
    console.log('Topic inserted into DB successfully');

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Error while generating questions:', error);
    res.status(500).json({ error: error.message });
  }
};