import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const [topic, setTopic] = useState('');
  const [youtubeURL, setYoutubeURL] = useState('');
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
        }
    } catch (error) {
        console.error('Error in handleSubmit:', error);
    } finally {
        setIsLoading(false); // Ensure the loader is deactivated in all scenarios
    }
};

return (
  <main className="flex min-h-screen flex-col items-center justify-start pt-20">
    <h1 className="text-4xl font-bold mb-3">Quiz Anything</h1>
    <p className="text-xl mb-6">Make a quiz about any topic or from a YouTube video</p>
    <div className="tabs mb-4">
      <button 
        onClick={() => setTab('topic')}
        className={`px-4 py-2 mr-2 rounded ${tab === 'topic' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        Topic
      </button>
      <button 
        onClick={() => setTab('youtube')}
        className={`px-4 py-2 rounded ${tab === 'youtube' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        YouTube
      </button>
    </div>
    <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
      <form onSubmit={handleSubmit} className="w-full">
        {tab === 'topic' ? (
          <input
            type="text"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
        ) : (
          <input
            type="text"
            placeholder="Enter a YouTube URL"
            value={youtubeURL}
            onChange={(e) => setYoutubeURL(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
        )}
        <button type="submit" disabled={isLoading} className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-4 px-16 rounded">
          {isLoading ? (
            <>
              <div className="loader inline-block mr-2"></div>
              Building your quiz! This may take a sec...
            </>
          ) : (
            'Start Quiz'
          )}
        </button>
      </form>
    </div>
  </main>
)};

export default Index;
