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
    setUserAnswers(prev => [...prev, { question: question.question, userAnswer: answer }]);

    if (answer === question.answer) {
      setScore(prev => prev + 1);
    }
    if (questionIndex + 1 === questions.length) {
      setGameStatus('finished');
      storeUserAnswers();
    } else {
      setQuestionIndex(prev => prev + 1);
    }
  }

  async function storeUserAnswers() {
    try {
      const response = await fetch('/api/storeUserAnswers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: sessionID,
          userAnswers: userAnswers,
        }),
      });
      const data = await response.json();
      console.log('storeUserAnswers response:', data);

      router.push(`/review?sessionID=${sessionID}`);
    } catch (error) {
      console.error('Error storing user answers:', error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex">
        {gameStatus === 'playing' && question && (
          <div className="w-full">
            <h2 className="text-3xl text-center font-bold mb-4">Q: {question.question}</h2>
            <h3 className="text-xl text-center font-bold mb-12">Score: {score} / {totalQuestions}</h3>
            <ul className="grid grid-cols-2 w-full gap-4">
              {question.answers.map(answer => {
                return (
                  <li key={answer}>
                    <ButtonAnswer onClick={() => handleAnswerClick(answer)}>
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