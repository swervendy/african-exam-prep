import { useMessages } from '../utils/useStepbyStepMessages'
import React, { useEffect, useRef, useState } from 'react';

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const generateAudio = async (message: string) => {
    setIsGeneratingAudio(true);
    try {
      const response = await fetch('/api/synthesizeSpeech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: message })    
      });
  
      if (!response.ok) {
        console.error('Error response from server:', response);
        return;
      }
  
      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return;
      }
  
      const { audioFilePath } = data;
  
      // Call the uploadToBlob API to upload the generated file to Azure Blob Storage
      const uploadResponse = await fetch('/api/uploadToBlob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audioFilePath })
      });
  
      const { audioUrl } = await uploadResponse.json();
  
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4">
     {messages?.map((message, i) => {
        const isUser = message.role === 'user'
        if (message.role === 'system') return null

        const handlePlayAudio = async () => {
          console.log('Generating audio for:', message.content);
          
          // Detect if the device is iOS
          const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        
          if (isIOS) {
            // Generate the audio
            const audioUrl = await generateAudio(message.content);
            
            // Log the audio URL
            console.log('Audio URL:', audioUrl);
            
            // Create an AudioContext and a BufferSourceNode
            const audioContext = new window.AudioContext();
            const source = audioContext.createBufferSource();
        
            // Fetch the audio file and decode it
            try {
              const response = await fetch(audioUrl);
              const arrayBuffer = await response.arrayBuffer();
              const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
              // Set the source buffer and connect to the output
              source.buffer = audioBuffer;
              source.connect(audioContext.destination);
        
              // Play the audio
              source.start(0);
            } catch (error) {
              console.error('Error occurred when loading or playing the audio:', error);
            }
          } else {
            // Fallback for non-iOS devices: use the HTML5 <audio> element
            const audioUrl = await generateAudio(message.content);
            const audio = new Audio(audioUrl);
            audio.oncanplaythrough = () => {
              console.log('Audio can play through.');
              audio.play().catch((error) => {
                console.error('Error occurred when trying to play:', error);
              });
            }
            audio.onerror = (error) => {
              console.error('Error occurred when loading the audio:', error);
            }
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
              className={`group relative px-3 py-2 rounded-lg flex flex-col justify-between text-right ${
                isUser
                  ? 'ml-2 bg-indigo-500 dark:bg-indigo-300 text-white dark:text-black'
                  : 'ml-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
              }`}
            >
              <div className="text-left">
                {message.content.split('. ').map((part, index) => {
                  if (part.startsWith('The correct answer was:')) {
                    return (
                      <>
                        <p key={index} className="font-bold">{part}</p>
                        <p key={`${index}-break`}>&nbsp;</p> {/* This adds a line break */}
                      </>
                    )
                  } else if (part.startsWith('Your answer was:')) {
                    return (
                      <>
                        <p key={index}>{part}</p>
                        <p key={`${index}-break`}>&nbsp;</p> {/* This adds a line break */}
                      </>
                    )
                  } else {
                    return <p key={index}>{part}</p>
                  }
                })}
              </div>
              {!isUser && (
                <button 
                onClick={handlePlayAudio} 
                className="self-end mt-2 bg-00 text-white font-bold py-2 px-4 rounded shadow active:shadow-none"
                disabled={isGeneratingAudio}
              >
                {isGeneratingAudio ? 'Loading...' : 'Play'}
              </button>
              )}
            </div>
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