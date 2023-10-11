import { Button } from '@apideck/components'
import { useMessages } from '../utils/useStepbyStepMessages'
import React from 'react';

const MessageForm: React.FC = () => {
  const { addMessage } = useMessages()

  const handleStartExplanation = async () => {
    addMessage("Start explanation", 'user', 'user') // 'user' is passed as the role and sender
  }

  return (
    <div className="flex justify-center items-center h-screen pb-">
      <Button className="inline-flex items-center justify-center border border-transparent leading-4 font-medium rounded transition duration-300 ease-in-out whitespace-nowrap bg-indigo-500 text-white shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:shadow-outline-indigo dark:hover:bg-indigo-500 px-6 py-3 text-lg" onClick={handleStartExplanation}>
        Start explanation
      </Button>
    </div>
  )
}

export default MessageForm