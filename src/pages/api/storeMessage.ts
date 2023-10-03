import { sql } from "@vercel/postgres";

export default async function storeMessage(req, res) {
  if (req.method === 'POST') {
    const { sessionID, role, content, sender } = req.body;

    try {
      // Convert the timestamp to seconds, then to a Date, and then to an ISO string
      const timestampInSeconds = Date.now() / 1000;
      const date = new Date(timestampInSeconds * 1000);
      const isoString = date.toISOString();

      await sql`
        INSERT INTO messages 
        (session_id, role, content, timestamp, sender) 
        VALUES 
        (${sessionID}, ${role}, ${content}, ${isoString}, ${sender})
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