import { useState, useEffect } from 'react';
import { shuffleArray } from '@/lib/util';
import ButtonAnswer from '@/components/ButtonAnswer';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing');
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [userUUID, setUserUUID] = useState(null);

  useEffect(() => {
    setUserUUID(localStorage.getItem('userUUID'));

    async function fetchQuestions() {
      try {
        const response = await fetch(`/api/getQuestions?uuid=${userUUID}`);
        const data = await response.json();

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

    if (userUUID) {
      fetchQuestions();
    }
  }, [userUUID]);

  const totalQuestions = questions.length;
  const question = questions[questionIndex];

  function startOver() {
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
            <p className="text-xl text-center font-bold mb-12">
              <button onClick={startOver}>Start Over</button>
            </p>
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
