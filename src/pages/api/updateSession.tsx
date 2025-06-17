import { NextApiRequest, NextApiResponse } from 'next';
import { sql } from "@vercel/postgres";

export default async function updateSession(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { userUUID, sessionTimestamp, sessionID, selectedSubject, questionCount } = req.body;

    try {
      await sql`
        UPDATE sessions 
        SET 
          selected_subject = ${selectedSubject}, 
          question_count = ${questionCount}
        WHERE 
          user_uuid = ${userUUID} AND 
          session_id = ${sessionID}
      `;
      res.status(200).json({ message: 'Session updated successfully!' });
    } catch (error) {
      console.error('Error updating session data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
