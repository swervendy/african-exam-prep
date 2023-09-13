import { connectToDB } from '../../lib/db';
import { YoutubeTranscript } from 'youtube-transcript';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export default async (req, res) => {
  if (req.method === 'POST') {
    const { youtubeUrl, uuid } = req.body;

    if (!youtubeUrl || !uuid) {
      return res.status(400).json({ error: 'YouTube URL and UUID are required.' });
    }

    try {
      const videoId = new URL(youtubeUrl).searchParams.get('v');

      if (!videoId) {
        return res.status(400).json({ error: 'Invalid YouTube URL.' });
      }

      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      const videoDetails = await fetchVideoDetails(videoId);

      const db = await connectToDB();
      const youtubeTranscriptsCollection = db.collection('youtubeTranscripts');

      // Insert into youtubeTranscripts collection
      await youtubeTranscriptsCollection.insertOne({
        uuid,
        createdAt: new Date().toISOString(),
        youtubeVideoDetails: videoDetails,
        transcript
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);  // This will log the detailed error
      return res.status(500).json({ error: 'Failed to fetch transcript.' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed.' });
  }
};

async function fetchVideoDetails(videoId) {
  const endpoint = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`;
  const response = await fetch(endpoint);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const video = data.items[0].snippet;
    return {
      videoTitle: video.title,
      videoDescription: video.description,
      videoThumbnail: video.thumbnails.default.url
    };
  } else {
    throw new Error('Failed to fetch video details.');
  }
}