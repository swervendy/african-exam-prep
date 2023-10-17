import { useMessages } from '../utils/useMessages'
import React, { useEffect, useRef, useState } from 'react';

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()
  const messagesEndRef = useRef(null)

  const [isGeneratingAudio, setIsGeneratingAudio] = useState({});
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string | null }>({});
  const [audioState, setAudioState] = useState<{ [key: string]: string }>({});
  const [currentAudio, setCurrentAudio] = useState<{ [key: string]: HTMLAudioElement | null }>({});
  const [playingMessage, setPlayingMessage] = useState(null);
  const [isAnyAudioLoading, setIsAnyAudioLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const generateAudio = async (message: string) => {
    setIsGeneratingAudio(prev => ({ ...prev, [message]: true })); 
    setIsAnyAudioLoading(true);
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
      setIsGeneratingAudio(prev => ({ ...prev, [message]: false })); // use message instead of message.content
      setIsAnyAudioLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto pt-8 px-4">
      {messages?.map((message, i) => {
        const isUser = message.role === 'user'
        if (message.role === 'system') return null

        const audioUrl = audioUrls[message.content];

        const handleGenerateAudio = async () => {
          // If another audio is playing, pause it
          if (playingMessage && playingMessage !== message.content && audioState[playingMessage] === 'playing') {
            currentAudio[playingMessage]?.pause();
            setAudioState(prev => ({ ...prev, [playingMessage]: 'paused' }));
          }
        
          // If the current audio is playing, pause it
          if (audioState[message.content] === 'playing') {
            currentAudio[message.content]?.pause();
            setAudioState(prev => ({ ...prev, [message.content]: 'paused' }));
            setPlayingMessage(null);
          } else if (audioState[message.content] === 'paused' || audioUrls[message.content]) {
            // If the audio has been paused or already generated, play it
            let audio = currentAudio[message.content];
            if (!audio) {
              audio = new Audio(audioUrl);
              setCurrentAudio(prev => ({ ...prev, [message.content]: audio }));
            }
            audio.play();
            setAudioState(prev => ({ ...prev, [message.content]: 'playing' }));
            setPlayingMessage(message.content);
            audio.onended = () => {
              setAudioState(prev => ({ ...prev, [message.content]: 'stopped' }));
              setCurrentAudio(prev => ({ ...prev, [message.content]: null }));
              setPlayingMessage(null);
            };
          } else {
            // Generate the audio
            const generatedAudioUrl = await generateAudio(message.content);
            setAudioUrls(prev => ({ ...prev, [message.content]: generatedAudioUrl }));
            const audio = new Audio(generatedAudioUrl);
            setCurrentAudio(prev => ({ ...prev, [message.content]: audio }));
            audio.play();
            setAudioState(prev => ({ ...prev, [message.content]: 'playing' }));
            setPlayingMessage(message.content);
            audio.onended = () => {
              setAudioState(prev => ({ ...prev, [message.content]: 'stopped' }));
              setCurrentAudio(prev => ({ ...prev, [message.content]: null }));
              setPlayingMessage(null);
            };
          }
        }

        return (
          <div
            id={`message-${i}`}
            className={`flex mb-4 fade-up ${isUser ? 'justify-end' : 'justify-start'} ${
              i === 1 ? 'max-w-md' : ''
            }`}
            key={message.content}
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
              <div className="text-left" dangerouslySetInnerHTML={{ __html: message.content.trim() }} />
              {!isUser && (
                <button 
                onClick={handleGenerateAudio} 
                className="self-end mt-2 bg-00 text-white font-bold py-2 px-4 rounded shadow active:shadow-none"
                disabled={isAnyAudioLoading || (audioState[message.content] === 'playing' && playingMessage !== message.content)}
              >
                {isGeneratingAudio[message.content] ? 'Loading...' : audioState[message.content] === 'playing' ? 'Pause' : audioState[message.content] === 'paused' ? 'Resume' : audioUrl ? 'Play Again' : 'Play'}
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