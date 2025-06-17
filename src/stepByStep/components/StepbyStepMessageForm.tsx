import { Button } from '@apideck/components'
import { useMessages } from '../utils/useStepbyStepMessages'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/router'

const MessageForm: React.FC = () => {
  const [content, setContent] = useState('')
  const { addMessage, remainingMessages, setRemainingMessages, isLoadingAnswer } = useMessages()
  const [explanationStarted, setExplanationStarted] = useState<boolean | string>(false);
  const [responseReceived, setResponseReceived] = useState(true); // Set initial state to true

  useEffect(() => {
    // When remainingMessages changes, it means a new message has been received and displayed
    setResponseReceived(true);
  }, [remainingMessages]);

  const buttonText = explanationStarted === 'final' ? 'Done' : (explanationStarted && remainingMessages.length === 1) ? 'Final step' : explanationStarted ? 'Next step' : 'Start explanation';
const router = useRouter()

const handleStartExplanation = async (e?: any) => {
  e?.preventDefault(); // Prevent form submission
  if (!explanationStarted) {
    addMessage('Start explanation', 'user', 'user'); // Add the "Start Explanation" message
    setExplanationStarted(true);
  } else if (explanationStarted && remainingMessages.length > 0) {
    const nextMessage = remainingMessages[0];
    await addMessage(nextMessage.content, nextMessage.role, 'assistant', nextMessage.audioUrl); // Pass audioUrl here
    setRemainingMessages(remainingMessages.slice(1));
    if (remainingMessages.length === 1) {
      setExplanationStarted('final');
    }
  } else if (explanationStarted === 'final') {
    router.back(); // Go back to the previous page
  }
  setResponseReceived(false); // Set responseReceived to false after starting the explanation
}

const buttonClass = "inline-flex items-center justify-center border border-indigo-500 leading-4 font-medium rounded-md transition duration-300 ease-in-out whitespace-nowrap bg-indigo-500 text-white shadow-inner shadow hover:shadow-md active:bg-indigo-600 hover:bg-indigo-700 focus:outline-none px-6 py-4 text-lg";
  return (
    <form className="relative mx-auto max-w-3xl rounded-t-xl pb-0 bg-white" onSubmit={handleStartExplanation}>
      <div className="flex items-center justify-center h-auto rounded-t-xl backdrop-blur border-t border-l border-r border-gray-500/10 dark:border-gray-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 py-3 px-5">
        <Button className={buttonClass} type="submit" style={{ minWidth: '130px' }}>
          {isLoadingAnswer ? <FontAwesomeIcon icon={faSpinner} spin /> : buttonText}
        </Button>
        </div>
        </form>
        )
        }

        export default MessageForm