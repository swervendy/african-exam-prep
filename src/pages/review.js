import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Review() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const sessionID = router.query.sessionID;

    async function fetchUserAnswers() {
      try {
        const response = await fetch(`/api/getUserAnswers?sessionID=${sessionID}`);
        const data = await response.json();
        console.log('getUserAnswers response:', data);

        setUserAnswers(data.userAnswers);
        setScore(data.score);
        setTotalQuestions(data.totalQuestions);
      } catch (error) {
        console.error('Error fetching user answers:', error);
      }
    }

    if (sessionID) {
      fetchUserAnswers();
    }
  }, [router.query.sessionID]);

  function tryAgain() {
    router.push(`/quiz?sessionID=${router.query.sessionID}`);
  }

  return (
    <div>
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
      {userAnswers && userAnswers.map((item, index) => (
        <div key={index}>
          <h2>Question {index + 1}</h2>
          <p>{item.question}</p>
          <p>Your answer: {item.userAnswer}</p>
          <button 
            onClick={() => router.push(`/tutor?question=${encodeURIComponent(item.question)}&answer=${encodeURIComponent(item.userAnswer)}`)} 
            className="flex justify-center items-center w-full h-full text-lg uppercase font-bold hover:text-slate-600 bg-white dark:bg-slate-500 hover:bg-yellow-300 border-4 border-cyan-300 hover:border-yellow-500 py-2 px-4 rounded">
            Chat with a Tutor
          </button>
        </div>
      ))}
    </div>
  );
}