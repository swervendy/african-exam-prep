import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { shuffleArray } from '@/lib/util';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

interface Question {
  question: string;
  answer: string;
  wrongAnswers: string[];
  answers: string[];
  option?: Record<string, string>;
}

interface UserAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const router = useRouter();
  const [sessionID, setSessionID] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  const handleBackClick = () => {
    router.back();
  };

  useEffect(() => {
    const retrievedUUID = localStorage.getItem('userUUID');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const combinedUUID = `${retrievedUUID}-${sessionTimestamp}`;
    // Retrieve the subject and questionCount from local storage
    const selectedSubject = localStorage.getItem('selectedSubject');
    const questionCount = localStorage.getItem('questionCount');
    console.log("Retrieved sessionID:", combinedUUID);
    setSessionID(combinedUUID);
  
    const fetchQuestions = async () => {
      try {
        const encodedSubject = encodeURIComponent(selectedSubject || '');
        const response = await fetch(`/api/fetchJambQuestions?subject=${encodedSubject}&num=${questionCount}`);
        const data = await response.json();
        console.log("API Response:", data);
    
        if (Array.isArray(data.data)) {
          setQuestions(data.data.map((q: any) => {
            if (q.option && typeof q.option === 'object') {
              // Convert the options object to an array of answers
              const answers = Object.values(q.option);
              // Find the correct answer based on the answer letter
              const correctAnswer = q.option[q.answer];
              // Remove the correct answer from the array of wrong answers
              const wrongAnswers = answers.filter((answer: string) => answer !== correctAnswer);
              // Remove duplicates from the array of answers
              const uniqueAnswers = Array.from(new Set([correctAnswer, ...wrongAnswers]));
              // Return the new question object
              return {
                ...q,
                answer: correctAnswer,
                wrongAnswers: wrongAnswers,
                // Mix the correct answer with the unique wrong answers
                answers: shuffleArray(uniqueAnswers)
              };
            } else {
              console.error('Option field is not an object:', q);
              return null;
            }
          }).filter((q: Question | null) => q !== null) as Question[]); // Filter out any null questions
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    
    // Call fetchQuestions inside the useEffect hook
    if (sessionID && selectedSubject) {
      fetchQuestions();
    }
  }, [sessionID]);

  const totalQuestions = questions.length;
  const question = questions[questionIndex];

  useEffect(() => {
    setIsAnswered(false);
  }, [questionIndex]);

  useEffect(() => {
    if (gameStatus === 'finished') {
      storeUserAnswers(userAnswers);
    }
  }, [gameStatus, userAnswers]);
  
  function handleAnswerClick(answer: string) {
    if (isAnswered || !question) return;
  
    setIsAnswered(true);
  
    // Get the text of the correct answer
    const correctAnswerText = question.answer;
  
    setUserAnswers(prev => {
      const updatedAnswers = [...prev, { question: question.question, userAnswer: answer, correctAnswer: correctAnswerText }];
  
      if (answer === question.answer) {
        setScore(prev => prev + 1);
      }
  
      const newQuestionIndex = questionIndex + 1;
  
      if (newQuestionIndex === questions.length) {
        setGameStatus('finished');
      } else {
        setTimeout(() => {
          setQuestionIndex(newQuestionIndex);
          setIsAnswered(false); // Reset the selected answer state here
        }, 1000);
      }
  
      return updatedAnswers;
    });
  }

  async function storeUserAnswers(updatedAnswers: UserAnswer[]) {
    try {
      localStorage.setItem('userAnswers', JSON.stringify(updatedAnswers));
      localStorage.setItem('questions', JSON.stringify(questions));
      localStorage.setItem('score', score.toString());
      localStorage.setItem('totalQuestions', questions.length.toString());
  
      // Add a delay before the redirection
      setTimeout(() => {
        router.push(`/review?sessionID=${sessionID}`);
      }, 1000);
    } catch (error) {
      console.error('Error storing user answers:', error);
    }
  }

  interface ButtonAnswerProps {
    children: React.ReactNode;
    onClick: () => void;
    isSelected: boolean;
  }

  function ButtonAnswer({ children, onClick, isSelected }: ButtonAnswerProps) {
    return (
      <>
        <button 
          onClick={onClick}
          className={`px-12 py-9 mb-2 w-full text-left rounded-lg flex items-center justify-between ${isSelected ? 'bg-white dark:bg-gray-500 text-black border border-indigo-500 shadow-md' : isAnswered ? 'bg-gray-100 cursor-default' : 'bg-gray-100 cursor-pointer'} font-semibold text-md dark:bg-gray-800 dark:text-white`}
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
      </>
    );
  }

  return (
    <main className="flex flex-col min-h-screen justify-between">
       <div className="z-10 w-full max-w-xl m-auto items-center justify-between px-8 lg:flex mt-8">        {gameStatus === 'playing' && question && (
          <div className="w-full">
            <h2 className="text-xl text-center font-bold mb-6">Q{questionIndex + 1}: {question.question}</h2>
            <h3 className="text-l text-center font-normal mb-12">Score: {score} / {totalQuestions}</h3>
            <ul className="grid grid-cols-1 w-full gap-4">
              {question.answers.map((answer, index) => {
                return (
                  <li key={`${questionIndex}-${index}`}>
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
      <div className="w-full py-4"></div> {/* This is an empty div to keep space at the bottom */}
    </main>
  );
}