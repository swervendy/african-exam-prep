import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const [topic, setTopic] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
  const [url, setUrl] = useState('');
  const [tab, setTab] = useState('topic'); // 'topic' or 'youtube'
  const router = useRouter();
  const [userUUID, setUserUUID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUUID = localStorage.getItem('userUUID');

    if (storedUUID) {
      setUserUUID(storedUUID);
    } else {
      storeUUIDInDB();
    }
  }, []);

  const storeUUIDInDB = async () => {
    try {
      const response = await fetch('/api/storeUUID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.uuid) {
        localStorage.setItem('userUUID', data.uuid);
        setUserUUID(data.uuid);
      } else {
        console.error('Failed to store UUID in MongoDB.');
      }
    } catch (error) {
      console.error('Error storing UUID:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Combine the stored UUID with a timestamp to create a unique session ID
    const sessionTimestamp = Date.now();
    const sessionID = `${userUUID}-${sessionTimestamp}`;
    localStorage.setItem('sessionTimestamp', sessionTimestamp.toString()); // Store the session timestamp

    try {
        if (tab === 'topic') {
            const response = await fetch('/api/generateQuestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, uuid: sessionID }), // Use the sessionID here
            });

            const data = await response.json();

            if (data && Array.isArray(data.questions) && data.questions.length > 0) {
                // If questions were successfully generated, redirect to the quiz page
                router.push('/quiz');
            } else {
                console.error('Failed to generate questions or no questions available.');
            }
        } else if (tab === 'youtube') {
            // Step 1: Submit the YouTube URL to getYoutubeTranscript.js
            const transcriptResponse = await fetch('/api/getYoutubeTranscript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ youtubeUrl: youtubeURL, uuid: sessionID }),
            });

            const transcriptData = await transcriptResponse.json();

            if (transcriptData.success) {
                // Step 2: Generate questions from the stored transcripts
                const questionsResponse = await fetch('/api/generateYoutubeQuestions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uuid: sessionID }),
                });

                const questionsData = await questionsResponse.json();

                if (questionsData && Array.isArray(questionsData.questions) && questionsData.questions.length > 0) {
                    router.push('/quiz');
                } else {
                    console.error('Failed to generate questions from YouTube transcript.');
                }
            } else {
                console.error('Failed to get YouTube transcript:', transcriptData.error);
            }
        } else if (tab === 'url') {
            // New code for handling URL submission
            const response = await fetch('/api/generateUrlQuestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url, uuid: sessionID }), // Use the sessionID here
            });

            const data = await response.json();

            if (data && Array.isArray(data.questions) && data.questions.length > 0) {
                // If questions were successfully generated, redirect to the quiz page
                router.push('/quiz');
            } else {
                console.error('Failed to generate questions or no questions available.');
            }
        }
    } catch (error) {
        console.error('Error in handleSubmit:', error);
    } finally {
        setIsLoading(false); // Ensure the loader is deactivated in all scenarios
    }
};

return (
  <main className="flex min-h-screen flex-col items-center justify-start pt-40 px-8 lg:px-40">
    <h1 className="text-4xl font-bold mb-3 text-center">Quiz Anything</h1>
    <p className="text-xl mb-6 text-center">Make a quiz about any topic, YouTube video, or URL</p>
    <div className="tabs mb-4">
    <div className="tabs mb-4 flex flex-wrap">
    <button 
  onClick={() => setTab('topic')}
  className={`px-4 py-2 mr-4 rounded flex items-center justify-between ${tab === 'topic' ? 'bg-white text-black border border-indigo-500 shadow-md' : 'bg-gray-100 hover:bg-white hover:text-black hover:border hover:border-indigo-500 cursor-pointer'}`}
    >
  <span className="font-medium">Topic</span>
  {tab === 'topic' && (
    <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )}
</button>

<button 
  onClick={() => setTab('youtube')}
  className={`px-4 py-2 mr-4 rounded flex items-center justify-between ${tab === 'youtube' ? 'bg-white text-black border border-indigo-500 shadow-md' : 'bg-gray-100 hover:bg-white hover:text-black hover:border hover:border-indigo-500 cursor-pointer'}`}
>
  <span className="font-medium">YouTube</span>
  {tab === 'youtube' && (
    <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )}
</button>

<button 
  onClick={() => setTab('url')}
  className={`px-4 py-2 rounded flex items-center justify-between ${tab === 'url' ? 'bg-white text-black border border-indigo-500 shadow-md' : 'bg-gray-100 hover:bg-white hover:text-black hover:border hover:border-indigo-500 cursor-pointer'}`}
>
  <span className="font-medium">URL</span>
  {tab === 'url' && (
    <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center ml-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    </span>
  )}
</button>
    </div>
            </div>
            <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-7 lg:flex">
              <form onSubmit={handleSubmit} className="w-full">
                {tab === 'topic' ? (
                  <input
                    type="text"
                    placeholder="Enter a topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-2 border-indigo-500 rounded mb-4 thin-border"
                  />
                ) : tab === 'youtube' ? (
                  <input
                    type="text"
                    placeholder="Enter a YouTube URL"
                    value={youtubeURL}
                    onChange={(e) => setYoutubeURL(e.target.value)}
                    className="w-full p-2 border-indigo-500 rounded mb-4 thin-border"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder="Enter a URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2 border-indigo-500 rounded mb-4 thin-border"
                  />
                )}
                <button type="submit" disabled={isLoading} className="flex justify-center items-center w-full h-full text-lg font-bold text-white bg-indigo-500 border-4 border-indigo-500 py-4 px-16 rounded-xl shadow-md">
  {isLoading ? (
   <div className="bouncing-loader horizontal">
      <span className="block w-3 h-3 rounded-full"></span>
      <span className="block w-3 h-3 rounded-full"></span>
      <span className="block w-3 h-3 rounded-full"></span>
      Building your quiz! This may take a sec...
  </div>
    
  ) : (
    'Start Quiz'
  )}
</button>
              </form>
            </div>
          </main>
        )};
        
        export default Index;