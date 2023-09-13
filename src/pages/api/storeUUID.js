import { v4 as uuidv4 } from 'uuid';
import { connectToDB } from '../../lib/db';

export default async (req, res) => {
  const db = await connectToDB();
  const uuidsCollection = db.collection('uuids');

  const newUUID = `${uuidv4()}-${Date.now()}`;
  await uuidsCollection.insertOne({ uuid: newUUID, createdAt: new Date() });

  res.status(200).json({ uuid: newUUID });
};
