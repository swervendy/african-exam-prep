import { connectToDB } from '../../lib/db';
import { generateYoutubeTriviaQuestions } from '../../scripts/generate-youtube-questions';

export default async (req, res) => {
  if (req.method !== 'POST') {
    console.error('Error: Invalid request method:', req.method);
    return res.status(405).end(); // Method Not Allowed
  }

  const { uuid } = req.body;

  // Basic input validation
  if (!uuid) {
    console.error('Error: UUID is missing in the request body.');
    return res.status(400).json({ error: 'UUID is required.' });
  }

  try {
    const db = await connectToDB();
    const youtubeTranscriptsCollection = db.collection('youtubeTranscripts');

    // Fetch the transcript for the given UUID
    const transcriptData = await youtubeTranscriptsCollection.findOne({ uuid });

    if (!transcriptData || !transcriptData.transcript) {
      console.error(`Error: Transcript not found for UUID: ${uuid}`);
      return res.status(404).json({ error: 'Transcript not found for the given UUID.' });
    }

    const questions = await generateYoutubeTriviaQuestions(transcriptData.transcript);

    const questionsCollection = db.collection('questions');
   
    // Insert the new questions
    await questionsCollection.insertOne({ 
      uuid, 
      questions, 
      createdAt: new Date()
    });

    return res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error('Error encountered:', error.message);
    console.error('Error stack trace:', error.stack); // This will give you a detailed stack trace of the error
    res.status(500).json({ error: error.message });
  }
};