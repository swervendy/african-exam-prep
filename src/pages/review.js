import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Review() {
  console.log('Rendering Review component');
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const retrievedScore = localStorage.getItem('score');
    const retrievedTotalQuestions = localStorage.getItem('totalQuestions');
    const retrievedUserAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    setScore(retrievedScore);
    setTotalQuestions(retrievedTotalQuestions);
    setUserAnswers(retrievedUserAnswers);
  }, []);

  function tryAgain() {
    router.push(`/quiz?sessionID=${router.query.sessionID}`);
  }

  function handleStepByStepExplanation(question, userAnswer, correctAnswer) {
    router.push(`/stepByStepTutor?mode=step-by-step&question=${encodeURIComponent(question)}&answer=${encodeURIComponent(userAnswer)}&correctAnswer=${encodeURIComponent(correctAnswer)}`);
  }

  function handleChatWithTutor(question, userAnswer, correctAnswer) {
    router.push(`/tutor?mode=chat&question=${encodeURIComponent(question)}&answer=${encodeURIComponent(userAnswer)}&correctAnswer=${encodeURIComponent(correctAnswer)}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start pt-20">
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        <div className="w-full">
          <h2 className="text-2xl text-center font-bold mb-6">Here&apos;s how you did -- click Discuss with a Tutor to get answer explanations</h2>
          <h3 className="text-xl text-center font-bold mb-4">Score: {score} / {totalQuestions}</h3>
          <div className="flex justify-center space-x-4 mt-2 mb-6">
            <button 
              onClick={tryAgain} 
              className="px-4 py-2 rounded flex items-center justify-between bg-white dark:bg-gray-500 text-black dark:text-white border border-gray-500 shadow-md">
              <span className="font-medium">Try again</span>
            </button>
            <button 
              onClick={() => router.push('/')} 
              className="px-4 py-2 rounded flex items-center justify-between bg-white dark:bg-gray-500 text-black dark:text-white border border-gray-500 shadow-md">
              <span className="font-medium">New quiz</span>
            </button>
          </div>
          {userAnswers && userAnswers.map((item, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-6">
              <h2 className="font-bold text-xl mb-2">Question {index + 1}</h2>
              <p className="mb-2">{item.question}</p>
              <p>Your answer: {item.userAnswer}</p>
              <p><strong>Correct answer: <strong>{item.correctAnswer}</strong></strong></p>
              <button 
                onClick={() => handleStepByStepExplanation(item.question, item.userAnswer, item.correctAnswer)} 
                className="flex justify-center items-center w-full h-full text-lg font-bold text-white bg-indigo-500 border-4 border-indigo-500 py-4 px-16 rounded-xl shadow-md mt-4">
                Step by step explanation
              </button>
              <button 
                onClick={() => handleChatWithTutor(item.question, item.userAnswer, item.correctAnswer)} 
                className="flex justify-center items-center w-full h-full text-lg font-bold text-white bg-indigo-500 border-4 border-indigo-500 py-4 px-16 rounded-xl shadow-md mt-4">
                Chat with tutor
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}