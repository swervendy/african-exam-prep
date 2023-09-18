import { useToast } from '@apideck/components'
import OpenAI from 'openai'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'
import { useRouter } from 'next/router';

interface ContextProps {
  messages: OpenAI.Chat.CreateChatCompletionRequestMessage[]
  addMessage: (content: string) => Promise<void>
  isLoadingAnswer: boolean
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const router = useRouter();
  const { question, answer } = router.query;
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initializeChat = () => {
      const systemMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: 'system',
        content: 'You are ChatGPT, a large language model trained by OpenAI, acting as a Nigerian tutor to educate Nigerian students.'
      }
      const welcomeMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: 'assistant',
        content: `You answered "${answer}" to the question "${question}" I'm your tutor, here to help you! How did you arrive at this answer?`
      }
      setMessages([systemMessage, welcomeMessage])
    }
  
    // When no messages are present and router.query has question and answer, we initialize the chat the system message and the welcome message
    // We hide the system message from the user in the UI
    if (!messages?.length && question && answer) {
      initializeChat()
    }
  }, [messages?.length, setMessages, question, answer])

  const addMessage = async (content: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: 'user',
        content
      }
      const newMessages = [...messages, newMessage]

      // Add the user message to the state so we can see it immediately
      setMessages(newMessages)

      const { data } = await sendMessage(newMessages)
      const reply = data.choices[0].message

      // Add the assistant message to the state
      setMessages([...newMessages, reply])
    } catch (error) {
      // Show error when something goes wrong
      addToast({ title: 'An error occurred', type: 'error' })
    } finally {
      setIsLoadingAnswer(false)
    }
  }

  return (
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}
