import { NextApiRequest, NextApiResponse } from 'next'
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk'
import { BlobServiceClient } from "@azure/storage-blob";
import fs from 'fs';
import path from 'path';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body

    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(process.env.AZURE_SUBSCRIPTION_KEY, process.env.AZURE_REGION)
    const audioFileName = `${Date.now()}.wav`;
    const audioFilePath = path.resolve('/tmp', audioFileName);
    const audioConfig = SpeechSDK.AudioConfig.fromAudioFileOutput(audioFilePath)
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig)

    synthesizer.speakTextAsync(
      text,
      result => {
        synthesizer.close()
        if (result) {
          res.status(200).json({ audioFilePath })
        } else {
          res.status(500).json({ error: 'Synthesis failed.' })
        }
      },
      error => {
        synthesizer.close()
        res.status(500).json({ error })
      }
    )
  } else {
    res.status(405).json({ error: 'Method not allowed.' })
  }
}