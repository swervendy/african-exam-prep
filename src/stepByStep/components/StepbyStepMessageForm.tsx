import { Button } from '@apideck/components'
import { useMessages } from '../utils/useStepbyStepMessages'
import React, { useState, useEffect } from 'react';

const MessageForm: React.FC = () => {
  const { addMessage, remainingMessages, setRemainingMessages } = useMessages()
  const [explanationStarted, setExplanationStarted] = useState<boolean | string>(false);
  const [responseReceived, setResponseReceived] = useState(true); // Set initial state to true

  useEffect(() => {
    // When remainingMessages changes, it means a new message has been received and displayed
    setResponseReceived(true);
  }, [remainingMessages]);

  const buttonText = explanationStarted === 'final' ? 'Get alternate explanation' : (explanationStarted && remainingMessages.length === 1) ? 'Final step' : explanationStarted ? 'Next step' : 'Start explanation';

  const handleStartExplanation = async () => {
    if (explanationStarted && remainingMessages.length > 0) {
      const nextMessage = remainingMessages[0];
      await addMessage(nextMessage.content, nextMessage.role, 'assistant', nextMessage.audioUrl); // Pass audioUrl here
      setRemainingMessages(remainingMessages.slice(1));
      if (remainingMessages.length === 1) {
        setExplanationStarted('final');
      }
    } else if (explanationStarted === 'final') {
      addMessage("Start explanation", 'user', 'user')
      setExplanationStarted(true);
    } else {
      addMessage("Start explanation", 'user', 'user')
      setExplanationStarted(true);
    }
    setResponseReceived(false); // Set responseReceived to false after starting the explanation
  }

  const buttonClass = explanationStarted === 'final' ? 
  "inline-flex items-center justify-center border border-indigo-500 leading-4 font-medium rounded-md transition duration-300 ease-in-out whitespace-nowrap bg-white text-indigo-500 shadow-inner shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none px-6 py-3 text-lg" : 
  "inline-flex items-center justify-center border border-transparent leading-4 font-medium rounded-md transition duration-300 ease-in-out whitespace-nowrap bg-indigo-500 text-white shadow-inner shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none px-6 py-3 text-lg";

  return (
    <div className="flex justify-center items-center h-screen pb-">
      {responseReceived && ( // Conditionally render the button based on responseReceived
        <button className={buttonClass} onClick={handleStartExplanation}>
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default MessageForm