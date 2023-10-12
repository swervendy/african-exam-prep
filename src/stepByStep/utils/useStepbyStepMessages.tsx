import { useToast } from '@apideck/components'
import OpenAI from 'openai'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendStepbyStepMessage'
import { useRouter } from 'next/router';

interface MessageWithAudio extends OpenAI.Chat.CreateChatCompletionRequestMessage {
  audioUrl?: string;
}

interface ContextProps {
  messages: MessageWithAudio[]
  addMessage: (content: string, role: "function" | "user" | "system" | "assistant", sender: string, audioUrl?: string) => Promise<void>
  isLoadingAnswer: boolean
  remainingMessages: MessageWithAudio[]
  setRemainingMessages: React.Dispatch<React.SetStateAction<MessageWithAudio[]>>
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children, correctAnswer }: { children: ReactNode, correctAnswer: string }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<MessageWithAudio[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const router = useRouter();
  const { question, answer } = router.query;
  const [remainingMessages, setRemainingMessages] = useState<MessageWithAudio[]>([]);

  useEffect(() => {
    const initializeChat = async () => {
      const systemMessage: MessageWithAudio = {
        role: 'system',
        content: 'You are a AI tutor backed by a large language model. You acting as a Nigerian tutor to educate Nigerian students. Speak in the simplest possible English that you can as if you are speaking to a 12 year old student. Explain answers to people step by step.'
      }
      const welcomeMessage: MessageWithAudio = {
        role: 'assistant',
        content: `This question was: "${question}"<br/><br/>Your answer was: ${answer}<br/><br/><strong class="font-bold">The correct answer was: ${correctAnswer}</strong><br/><br/>Click START EXPLANATION to have the problem explained!`
      }
      setMessages([systemMessage, welcomeMessage])
  
      // Store the welcome message in the database
      await fetch('/api/storeWelcomeMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionID: localStorage.getItem('sessionID'), role: welcomeMessage.role, content: welcomeMessage.content, sender: 'assistant' })
      })
    }
  
    if (!messages?.length && question && answer) {
      initializeChat()
    }
  }, [messages?.length, setMessages, question, answer])

  const addMessage = async (content: string, role: "function" | "user" | "system" | "assistant", sender: string, audioUrl?: string) => {
    setIsLoadingAnswer(true)
  
    try {
      const newMessage: MessageWithAudio = {
        role,
        content,
        audioUrl
      }
      const newMessages = [...messages, newMessage]
  
      // Add the message to the state
      setMessages(newMessages)
  
      if (role === 'user') {
        const { data } = await sendMessage(newMessages.map(message => ({ role: message.role, content: message.content })))
        const assistantContent = data.choices[0].message.content
  
        // Split the assistantContent into separate messages
        const assistantMessages = assistantContent.split('\n\n');
  
        // Add the first message to the state
        const firstMessage: MessageWithAudio = {
          role: 'assistant',
          content: assistantMessages[0],
        }
        setMessages([...newMessages, firstMessage])
  
        // Store the remaining messages in the state
        setRemainingMessages(assistantMessages.slice(1).map(message => ({
          role: 'assistant',
          content: message,
        })));
  
        // Set isLoadingAnswer to false after all processing is complete
        setIsLoadingAnswer(false)
      } else {
        // If the role is not 'user', set isLoadingAnswer to false immediately
        setIsLoadingAnswer(false)
      }
    } catch (error) {
      console.error('Error in addMessage:', error.message)
      console.error('Stack trace:', error.stack)
      addToast({ title: 'An error occurred', type: 'error' })
    }
  }

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer, remainingMessages, setRemainingMessages }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}