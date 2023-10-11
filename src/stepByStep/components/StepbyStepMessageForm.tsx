import { Button } from '@apideck/components'
import { useMessages } from '../utils/useStepbyStepMessages'
import React, { useState } from 'react';

const MessageForm: React.FC = () => {
  const { addMessage, remainingMessages, setRemainingMessages } = useMessages()
  const [explanationStarted, setExplanationStarted] = useState<boolean | string>(false);

  const handleStartExplanation = async () => {
    if (explanationStarted && remainingMessages.length > 0) {
      // If the explanation has already started and there are remaining messages, add the next message to the list
      addMessage(remainingMessages[0], 'assistant', 'assistant');
      setRemainingMessages(remainingMessages.slice(1));
      if (remainingMessages.length === 1) {
        setExplanationStarted('final');
      }
    } else if (explanationStarted === 'final') {
      // If the explanation is final, retrigger the response from OpenAI
      addMessage("Start explanation", 'user', 'user') // 'user' is passed as the role and sender
      setExplanationStarted(true);
    } else {
      // If the explanation hasn't started yet, start it
      addMessage("Start explanation", 'user', 'user') // 'user' is passed as the role and sender
      setExplanationStarted(true);
    }
  }
  
  const buttonText = explanationStarted === 'final' ? 'Get alternate explanation' : explanationStarted ? 'Next step' : 'Start explanation';
  const buttonClass = explanationStarted === 'final' ? 
  "inline-flex items-center justify-center border border-indigo-500 leading-4 font-medium rounded-md transition duration-300 ease-in-out whitespace-nowrap bg-white text-indigo-500 shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none px-6 py-3 text-lg" : 
  "inline-flex items-center justify-center border border-transparent leading-4 font-medium rounded-md transition duration-300 ease-in-out whitespace-nowrap bg-indigo-500 text-white shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none px-6 py-3 text-lg";

  return (
    <div className="flex justify-center items-center h-screen pb-">
      <button className={buttonClass} onClick={handleStartExplanation}>
        {buttonText}
      </button>
    </div>
  )
}

export default MessageForm