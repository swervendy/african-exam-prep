import { NextApiRequest, NextApiResponse } from 'next'
import { BlobServiceClient } from "@azure/storage-blob";
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { audioFilePath } = req.body

    try {
      // Create the BlobServiceClient object
      const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

      // Get a reference to a container
      const containerClient = blobServiceClient.getContainerClient("audio-blob");

      // Create a unique name for the blob
      const blobName = path.basename(audioFilePath);

      // Get a block blob client
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      // Upload data to the blob
      const uploadBlobResponse = await blockBlobClient.uploadFile(audioFilePath, {
        blobHTTPHeaders: {
          blobContentType: 'audio/mpeg',
        },
      });

      // Now the audio file is uploaded to Azure Blob Storage, and you can get the URL of the blob
      const audioUrl = blockBlobClient.url;

      // Send the URL to the audio file as the response
      res.status(200).json({ audioUrl })
    } catch (error) {
        console.error('Error uploading to Azure Blob Storage:', error);
        res.status(500).json({ error: `Error uploading to Azure Blob Storage: ${error.message}` });
      }
  } else {
    res.status(405).json({ error: 'Method not allowed.' })
  }
}