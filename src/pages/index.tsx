import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBook, faPlus, faDollarSign, faBalanceScale, faLeaf, faFlask, faGlobe, faBookOpen, faLandmark, faCross, faMountain, faChartLine, faMoon, faFlagUsa, faHistory } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

export default function Index() {
  const [subject, setSubject] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedQuestionCount, setSelectedQuestionCount] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const router = useRouter();

  const subjects: { name: string, apiName: string, icon: any }[] = [
    { name: 'English', apiName: 'english', icon: faBook },
    { name: 'Mathematics', apiName: 'mathematics', icon: faPlus },
    { name: 'Commerce', apiName: 'commerce', icon: faDollarSign },
    { name: 'Accounting', apiName: 'accounting', icon: faBalanceScale },
    { name: 'Biology', apiName: 'biology', icon: faLeaf },
    { name: 'Physics', apiName: 'physics', icon: faFlask },
    { name: 'Chemistry', apiName: 'chemistry', icon: faFlask },
    { name: 'English Literature', apiName: 'englishlit', icon: faBookOpen },
    { name: 'Government', apiName: 'government', icon: faLandmark },
    { name: 'CRK', apiName: 'crk', icon: faCross },
    { name: 'Geography', apiName: 'geography', icon: faGlobe },
    { name: 'Economics', apiName: 'economics', icon: faChartLine },
    { name: 'IRK', apiName: 'irk', icon: faMoon },
    { name: 'Civil Education', apiName: 'civiledu', icon: faFlagUsa },
    { name: 'Insurance', apiName: 'insurance', icon: faDollarSign },
    { name: 'Current Affairs', apiName: 'currentaffairs', icon: faFlagUsa },
    { name: 'History', apiName: 'history', icon: faHistory },
  ].sort((a, b) => a.name.localeCompare(b.name));
  
  const questionCounts: number[] = [5, 10, 20, 30];

  const handleSubjectClick = (subject: { name: string, apiName: string, icon: any }) => {
    setSelectedSubject(subject.name);
    setTimeout(() => {
      setSubject(subject.apiName); // use apiName for API calls
      setStep(1);
    }, 1000); // question select delay
  };

  const handleQuestionCountClick = (count: number) => {
    setSelectedQuestionCount(count);
    setTimeout(() => {
      setQuestionCount(count);
      router.push('/quiz');
    }, 1000); // question select delay
  };

  const handleBackClick = () => {
    setStep(0);
    setSelectedSubject(null); // Reset selected subject
  };

  useEffect(() => {
    if (subject) {
      localStorage.setItem('selectedSubject', subject);
    }
  }, [subject]);

  useEffect(() => {
    if (questionCount) {
      localStorage.setItem('questionCount', questionCount.toString());
    }
  }, [questionCount]);

  return (
    <main className="flex flex-col min-h-screen justify-between">
      <nav className="w-full flex justify-center items-center py-4 bg-white shadow-sm pb-4" style={{height: '70px'}}>
      <div className="absolute left-0 pl-4">
        {step !== 0 && (
          <button 
            onClick={handleBackClick}
            className="px-6 py-3 rounded bg-white hover:border hover:border-indigo-500 cursor-pointer font-semibold text-md dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
      </div>
        <div className="flex justify-center">
          <Image src="/logo.svg" alt="Logo" width={150} height={150} /> {/* Adjust width and height as needed */}
        </div>
      </nav>
      <div className="flex-grow flex flex-col items-center justify-center">
        {step === 0 ? (
          <>
            <h1 className="text-md font-style: italic mb-3 text-center mt-6 px-12 sm:px-0">Practice JAMB questions and learn from an AI tutor FOR FREE</h1>
            <h2 className="text-xl mb-3 font-bold text-center">Select a Subject</h2>
            <div className="grid grid-cols-2 gap-4">
              {subjects.map((subject) => (
                <button 
                  key={subject.name} 
                  onClick={() => handleSubjectClick(subject)}
                  disabled={selectedSubject !== null}
                  className={`px-2 sm:px-6 py-4 rounded flex flex-col items-center justify-center border-2 shadow-sm ${subject.name === selectedSubject ? 'bg-white dark:bg-gray-500 text-black border border-indigo-500 shadow-md' : 'bg-white hover:border hover:border-indigo-500 cursor-pointer'} font-semibold text-md dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500`}
                >
                  <FontAwesomeIcon icon={subject.icon} color="Mediumslateblue" />
                  <span className="font-medium mt-2">{subject.name}</span>
                  {subject.name === selectedSubject && (
                    <span className="inline-flex items-center justify-center ml-2">
                      <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl mb-3 text-center">Select Number of Questions</h2>
            <div className="grid grid-cols-2 gap-4">
              {questionCounts.map((count) => (
                <button 
                  key={count} 
                  onClick={() => handleQuestionCountClick(count)}
                  disabled={selectedQuestionCount !== null}
                  className={`px-6 py-4 rounded flex items-center justify-center border-2 shadow-sm ${count === selectedQuestionCount ? 'bg-white dark:bg-gray-800 text-black border border-indigo-500 shadow-md' : 'bg-white border-gray-200 hover:border hover:border-indigo-500 cursor-pointer'} font-semibold text-md dark:bg-gray-800 dark:text-white dark:hover:border-indigo-500`}
                >
                  <span className="font-medium">{count}</span>
                  {count === selectedQuestionCount && (
                    <span className="inline-flex items-center justify-center ml-2">
                      <span className="bg-indigo-500 rounded-full w-5 h-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="w-full py-4"></div> {/* This is an empty div to keep space at the bottom */}
    </main>
  );
  }