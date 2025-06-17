import { MongoClient, Db } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI as string);

export default async function dbConnect(): Promise<{ db: Db; client: MongoClient }> {
  try {
    await client.connect();
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
  
  const db = client.db(process.env.MONGODB_DB as string); // database name
  return { db, client };
}