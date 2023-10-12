import { useMessages } from '../utils/useStepbyStepMessages'
import React, { useEffect, useRef } from 'react';

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const generateAudio = async (message: string) => {
    // Call the synthesizeSpeech API
    const response = await fetch('/api/synthesizeSpeech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: message })
    })

    const { audioFilePath } = await response.json()

    // Call the uploadToBlob API to upload the generated file to Azure Blob Storage
    const uploadResponse = await fetch('/api/uploadToBlob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ audioFilePath })
    })

    const { audioUrl } = await uploadResponse.json()

    return audioUrl;
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4">
     {messages?.map((message, i) => {
        const isUser = message.role === 'user'
        if (message.role === 'system') return null

        const handlePlayAudio = async () => {
          console.log('Generating audio for:', message.content);
        
          // Generate the audio
          const audioUrl = await generateAudio(message.content);
        
          // Play the audio
          const audio = new Audio(audioUrl);
          audio.oncanplaythrough = () => {
            console.log('Audio can play through.');
            audio.play();
          }
          audio.onerror = (error) => {
            console.error('Error playing audio:', error);
          }
        }

        return (
          <div
            id={`message-${i}`}
            className={`flex mb-4 fade-up ${isUser ? 'justify-end' : 'justify-start'} ${
              i === 1 ? 'max-w-md' : ''
            }`}
            key={message.content}
            style={{ position: 'relative' }} // Add this line
          >
            {!isUser && (
              <img
                src="/img/tutor-avatar.png" 
                className="w-9 h-9 rounded-full"
                alt="avatar"
              />
            )}
            <div
              style={{ maxWidth: 'calc(100% - 45px)' }}
              className={`group relative px-3 py-2 rounded-lg ${
                isUser
                  ? 'ml-2 bg-indigo-500 dark:bg-indigo-300 text-white dark:text-black'
                  : 'ml-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
              dangerouslySetInnerHTML={{ __html: message.content.trim() }}
            />
            {!isUser && (
              <button onClick={handlePlayAudio} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                Play
              </button>
            )}
            {isUser && (
              <img
                src="https://www.teamsmart.ai/next-assets/profile-image.png"
                className="w-9 h-9 rounded-full cursor-pointer"
                alt="avatar"
              />
            )}
          </div>
        )
      })}
      {isLoadingAnswer && (
        <div className="flex justify-start mb-4">
          <img
            src="img/tutor-avatar.png"
            className="w-9 h-9 rounded-full"
            alt="avatar"
          />
          <div className="bouncing-loader ml-2 p-2.5 px-4 bg-gray-200 dark:bg-gray-800 rounded-full space-x-1.5 flex justify-between items-center relative">
            <span className="block w-3 h-3 rounded-full"></span>
            <span className="block w-3 h-3 rounded-full"></span>
            <span className="block w-3 h-3 rounded-full"></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList