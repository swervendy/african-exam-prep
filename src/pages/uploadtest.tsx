import React, { useEffect } from 'react';

export default function TestPage() {
  useEffect(() => {
    testSpeechAndUpload();
  }, []);

  async function testSpeechAndUpload() {
    try {
      // Call the synthesizeSpeech API to generate the speech file
      const speechResponse = await fetch('/api/synthesizeSpeech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: 'Dem talk say boys na the best. Dem don hustle well-well and soon revolution go come and we all go hammer!' }) // Replace with your text
      })

      const { audioFilePath } = await speechResponse.json()

      // Call the uploadToBlob API to upload the generated file to Azure Blob Storage
      const uploadResponse = await fetch('/api/uploadToBlob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioFilePath })
      })

      const { audioUrl } = await uploadResponse.json()

      console.log('Audio URL:', audioUrl)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
}