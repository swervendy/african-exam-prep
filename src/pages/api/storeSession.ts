import { sql } from "@vercel/postgres";

export default async function storeSession(req, res) {
  if (req.method === 'POST') {
    const { userUUID, sessionTimestamp, sessionID, selectedSubject, questionCount } = req.body;

    try {
      await sql`
        INSERT INTO sessions 
        (user_uuid, session_timestamp, session_id, selected_subject, question_count) 
        VALUES 
        (${userUUID}, ${sessionTimestamp}, ${sessionID}, ${selectedSubject}, ${questionCount})
      `;
      res.status(200).json({ message: 'Session stored successfully!' });
    } catch (error) {
      console.error('Error storing session data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
