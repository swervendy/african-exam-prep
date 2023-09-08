import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const [topic, setTopic] = useState('');
  const router = useRouter();
  const [userUUID, setUserUUID] = useState('');
  const [sessionMessage, setSessionMessage] = useState(null);

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

    try {
      const response = await fetch('/api/generateQuestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, uuid: userUUID }),
      });

      const data = await response.json();

      if (data.message) {
        setSessionMessage(data.message);
      } else if (response.ok) {
        router.push('/quiz');
      } else {
        console.error('Failed to generate questions.');
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        <h1 className="text-3xl text-center font-bold mb-4">Choose a Quiz Topic</h1>
        {sessionMessage && <p>{sessionMessage}</p>}
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-4 px-16 rounded">
            Start Quiz
          </button>
        </form>
      </div>
    </main>
  );
}

export default Index;
