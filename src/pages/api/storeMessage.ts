import { sql } from "@vercel/postgres";

export default async function storeMessage(req, res) {
  if (req.method === 'POST') {
    const { sessionID, role, content } = req.body;

    try {
      await sql`
        INSERT INTO messages 
        (session_id, role, content, timestamp) 
        VALUES 
        (${sessionID}, ${role}, ${content}, ${Date.now()})
      `;
      res.status(200).json({ message: 'Message stored successfully!' });
    } catch (error) {
      console.error('Error storing message:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}