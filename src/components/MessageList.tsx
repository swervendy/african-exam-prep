import { useMessages } from '../utils/useMessages'
import React, { useEffect, useRef, useState } from 'react';
import { faPlay, faPause, faRedo, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    });
    return () => {
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedValue = x * audio.duration / rect.width;
    if (Number.isFinite(clickedValue)) {
      audio.currentTime = clickedValue;
    }
  };

  return (
    <div>
      <button onClick={togglePlayPause}>{audioRef.current && audioRef.current.paused ? 'Play' : 'Pause'}</button>
      <div onClick={handleProgressClick} style={{ width: '100%', height: '20px', background: 'lightgray' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'blue' }}></div>
      </div>
      <audio ref={audioRef} src={src} preload="metadata"></audio>
    </div>
  );
};

const MessagesList = () => {
  const { messages, isLoadingAnswer } = useMessages()
  const messagesEndRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false); // Add this line

  const messageListRef = useRef(null); // Add this line

  const scrollToBottom = () => {
    if (messages.length > 2) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(scrollToBottom, [messages, isLoadingAnswer]);

  const [isGeneratingAudio, setIsGeneratingAudio] = useState({});
  const [audioUrls, setAudioUrls] = useState<{ [key: string]: string | null }>({});
  const [audioState, setAudioState] = useState<{ [key: string]: string }>({});
  const [currentAudio, setCurrentAudio] = useState<{ [key: string]: HTMLAudioElement | null }>({});
  const [playingMessage, setPlayingMessage] = useState(null);
  const [isAnyAudioLoading, setIsAnyAudioLoading] = useState(false);

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
    <div className="max-w-3xl mx-auto pt-8 px-4 pb-20">
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
            audio = new Audio(audioUrls[message.content]);
            setCurrentAudio(prev => ({ ...prev, [message.content]: audio }));
          }
          audio.play();
          setAudioState(prev => ({ ...prev, [message.content]: 'playing' }));
          setPlayingMessage(message.content);
      
          // Update audioState when the audio ends
          audio.onended = () => {
            setAudioState(prev => ({ ...prev, [message.content]: 'stopped' }));
            setPlayingMessage(null);
          };
        } else {
          console.log('Generating audio for:', message.content);
          // Generate the audio
          const generatedAudioUrl = await generateAudio(message.content); // pass message.content instead of message
      
          // Set the audioUrl state
          setAudioUrls(prev => ({ ...prev, [message.content]: generatedAudioUrl }));
      
          // Start playing the audio
          setIsPlaying(true);
          setAudioState(prev => ({ ...prev, [message.content]: 'playing' }));
          setPlayingMessage(message.content); // Add this line
      
          // Try playing the audio directly here
          const audio = new Audio(generatedAudioUrl);
          setCurrentAudio(prev => ({ ...prev, [message.content]: audio }));
          audio.play();
      
          // Update audioState when the audio ends
          audio.onended = () => {
            setAudioState(prev => ({ ...prev, [message.content]: 'stopped' }));
            setCurrentAudio(prev => ({ ...prev, [message.content]: null }));
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
          style={{ 
            position: 'relative',
            marginBottom: '10px', // Add a fixed margin-bottom to all messages
          }}
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
                    <React.Fragment key={index}>
                      <p className="font-bold">{part}</p>
                      <p>&nbsp;</p> {/* This adds a line break */}
                    </React.Fragment>
                  )
                } else if (part.startsWith('Your answer was:')) {
                  return (
                    <React.Fragment key={index}>
                                            <p>{part}</p>
                      <p>&nbsp;</p> {/* This adds a line break */}
                    </React.Fragment>
                  )
                } else {
                  return <p key={index}>{part}</p>
                }
              })}
            </div>
            {!isUser && (
              <button 
              onClick={handleGenerateAudio} 
              className="w-full mt-2 bg-gray text-gray font-bold py-2 px-4 rounded shadow active:shadow-none"
              disabled={isAnyAudioLoading || (audioState[message.content] === 'playing' && playingMessage !== message.content)}
            >
              {isGeneratingAudio[message.content] ? <FontAwesomeIcon icon={faSpinner} spin /> : audioState[message.content] === 'playing' ? <FontAwesomeIcon icon={faPause} /> : audioState[message.content] === 'paused' ? <FontAwesomeIcon icon={faPlay} /> : audioUrl ? <FontAwesomeIcon icon={faRedo} /> : <FontAwesomeIcon icon={faPlay} />}
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