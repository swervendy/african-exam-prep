import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { shuffleArray } from '@/lib/util';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const router = useRouter();

  const [sessionID, setSessionID] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const retrievedUUID = localStorage.getItem('userUUID');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const combinedUUID = `${retrievedUUID}-${sessionTimestamp}`;
    console.log("Retrieved sessionID:", combinedUUID);
    setSessionID(combinedUUID);

    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/getQuestions?uuid=${sessionID}`);
        const data = await response.json();
        console.log("API Response:", data);

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
  }, [sessionID]);

  const totalQuestions = questions.length;
  const question = questions[questionIndex];

  function handleAnswerClick(answer) {
    if (isAnswered) return;

    setIsAnswered(true);

    setUserAnswers(prev => {
      const updatedAnswers = [...prev, { question: question.question, userAnswer: answer }];
  
      if (answer === question.answer) {
        setScore(prev => prev + 1);
      }
  
      const newQuestionIndex = questionIndex + 1;
  
      if (newQuestionIndex === questions.length) {
        setGameStatus('finished');
        setTimeout(() => storeUserAnswers(updatedAnswers), 1000);
      } else {
        setTimeout(() => setQuestionIndex(newQuestionIndex), 1000);
      }
  
      return updatedAnswers;
    });
  }

  useEffect(() => {
    setIsAnswered(false);
  }, [questionIndex]);

  async function storeUserAnswers(updatedAnswers) {
    try {
      localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers));
  
      const response = await fetch('/api/storeUserAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: sessionID,
          userAnswers: updatedAnswers,
        }),
      });
      const data = await response.json();
      console.log('storeUserAnswers response:', data);
  
      localStorage.setItem('score', score);
      localStorage.setItem('totalQuestions', questions.length);
  
      router.push(`/review?sessionID=${sessionID}`);
    } catch (error) {
      console.error('Error storing user answers:', error);
    }
  }

  function ButtonAnswer({ children, onClick, isSelected }) {
    return (
      <button 
        onClick={onClick}
        className={`px-12 py-9 mb-2 w-full text-left rounded-lg flex items-center justify-between ${isSelected ? 'bg-white text-black border border-indigo-500 shadow-md' : isAnswered ? 'bg-gray-100 cursor-default' : 'bg-gray-100 hover:border hover:border-indigo-500 cursor-pointer'} font-semibold text-md`}
        disabled={isAnswered}
      >
        <span>{children}</span>
        {isSelected && (
          <span className="inline-flex items-center justify-center ml-2">
            <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </span>
        )}
      </button>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        {gameStatus === 'playing' && question && (
          <div className="w-full">
            <h2 className="text-3xl text-center font-bold mb-6">Q: {question.question}</h2>
            <h3 className="text-xl text-center font-bold mb-12">Score: {score} / {totalQuestions}</h3>
            <ul className="grid grid-cols-1 w-full gap-4">
              {question.answers.map(answer => {
                return (
                  <li key={answer}>
                    <ButtonAnswer onClick={() => handleAnswerClick(answer)} isSelected={userAnswers[userAnswers.length - 1]?.userAnswer === answer}>
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