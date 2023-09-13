import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { shuffleArray } from '@/lib/util';
import ButtonAnswer from '@/components/ButtonAnswer';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const router = useRouter();

  const [sessionID, setSessionID] = useState(null); // Using sessionID instead of userUUID

  useEffect(() => {
    const retrievedUUID = localStorage.getItem('userUUID');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp'); // Retrieve the session timestamp
    const combinedUUID = `${retrievedUUID}-${sessionTimestamp}`; // Combine them
    console.log("Retrieved sessionID:", combinedUUID);  // Log the retrieved sessionID
    setSessionID(combinedUUID); // Set the combined UUID as sessionID

    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/getQuestions?uuid=${sessionID}`); // Use sessionID here
        const data = await response.json();
        console.log("API Response:", data);  // Log the API response

        if (Array.isArray(data)) {
          setQuestions(data.map(q => ({
            ...q,
            answers: shuffleArray([q.answer, ...q.wrongAnswers])
          })));
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    if (sessionID) {
      fetchQuestions();
    }
  }, [sessionID]); // Watch for changes in sessionID

  const totalQuestions = questions.length;
  const question = questions[questionIndex];

  function tryAgain() {
    setGameStatus('playing');
    setScore(0);
    setQuestionIndex(0);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        {gameStatus === 'finished' && (
          <div className="w-full">
            <h2 className="text-3xl text-center font-bold mb-4">Here&apos;s how you did!</h2>
            <p className="text-xl text-center font-bold mb-12">
              Your score was {score} / {totalQuestions}
            </p>
            <div className="flex justify-center space-x-4 mt-6">
              <button 
                onClick={tryAgain} 
                className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-2 px-4 rounded">
                Try this quiz again
              </button>
              <button 
                onClick={() => router.push('/')} 
                className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-2 px-4 rounded">
                Create a new quiz
              </button>
            </div>
          </div>
        )}
        {gameStatus === 'playing' && question && (
          <div className="w-full">
            <h2 className="text-3xl text-center font-bold mb-4">Q: {question.question}</h2>
            <h3 className="text-xl text-center font-bold mb-12">Score: {score} / {totalQuestions}</h3>
            <ul className="grid grid-cols-2 w-full gap-4">
              {question.answers.map(answer => {
                function handleOnClick(e) {
                  e.preventDefault();
                  if (answer === question.answer) {
                    setScore(prev => prev + 1);
                  }
                  if (questionIndex + 1 === questions.length) {
                    setGameStatus('finished');
                  } else {
                    setQuestionIndex(prev => prev + 1);
                  }
                }
                return (
                  <li key={answer}>
                    <ButtonAnswer onClick={handleOnClick}>
                      {answer}
                    </ButtonAnswer>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}