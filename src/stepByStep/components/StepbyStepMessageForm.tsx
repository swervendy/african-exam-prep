import { Button } from '@apideck/components'
import { useMessages } from '../utils/useStepbyStepMessages'
import React, { useState } from 'react';

const MessageForm: React.FC = () => {
  const { addMessage, remainingMessages, setRemainingMessages } = useMessages()
  const [explanationStarted, setExplanationStarted] = useState(false);

  const handleStartExplanation = async () => {
    if (explanationStarted && remainingMessages.length > 0) {
      // If the explanation has already started and there are remaining messages, add the next message to the list
      addMessage(remainingMessages[0], 'assistant', 'assistant');
      setRemainingMessages(remainingMessages.slice(1));
    } else {
      // If the explanation hasn't started yet, start it
      addMessage("Start explanation", 'user', 'user') // 'user' is passed as the role and sender
      setExplanationStarted(true);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen pb-">
      <Button className="inline-flex items-center justify-center border border-transparent leading-4 font-medium rounded transition duration-300 ease-in-out whitespace-nowrap bg-indigo-500 text-white shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:shadow-outline-indigo dark:hover:bg-indigo-500 px-6 py-3 text-lg" onClick={handleStartExplanation}>
        {explanationStarted ? "Next step" : "Start explanation"}
      </Button>
    </div>
  )
}

export default MessageForm