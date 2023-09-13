import { connectToDB } from '../../lib/db';
import { generateUrlTriviaQuestions } from '../../scripts/generate-url-questions';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { url, uuid } = req.body;

  // Basic input validation
  if (!url || !uuid) {
    return res.status(400).json({ error: 'URL and UUID are required.' });
  }

  try {
    const questions = await generateUrlTriviaQuestions(url);
    const db = await connectToDB();

    // Insert the new questions
    const questionsCollection = db.collection('questions');
    await questionsCollection.insertOne({ 
      uuid, 
      questions, 
      createdAt: new Date(), 
      url 
    });

    // Insert the URL
    const urlsCollection = db.collection('urls');
    await urlsCollection.insertOne({
      uuid,
      urlName: url,
      createdAt: new Date()
    });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};