import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const encodedSubject = encodeURIComponent(String(req.query.subject));
    const questionCount = String(req.query.num);
    console.log(`Fetching ${questionCount} questions for subject: ${encodedSubject}`);
    
    const response = await fetch(`https://questions.aloc.com.ng/api/v2/q/${questionCount}?subject=${encodedSubject}&type=utme`, {
      headers: {
        'Accept': 'application/json',
        'AccessToken': 'QB-7e1a3aa87826a35db649',
      },
    });
    
    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2)); // This will log the response data to the terminal
  
    res.status(200).json(data);
  };