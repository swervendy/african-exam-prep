import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const [topic, setTopic] = useState('');
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

    try {
      const response = await fetch('/api/generateQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, uuid: userUUID }),
      });

      if (response.ok) {
        router.push('/quiz');
      } else {
        console.error('Failed to generate questions.');
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
    }

    setIsLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-20">
      <h1 className="text-4xl font-bold mb-3">Quiz Anything</h1>
      <p className="text-xl mb-6">Make a quiz about any topic</p>
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
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
  );
}

export default Index;