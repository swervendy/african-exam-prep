import { useToast } from '@apideck/components'
import OpenAI from 'openai'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'
import { useRouter } from 'next/router';

interface ContextProps {
  messages: OpenAI.Chat.CreateChatCompletionRequestMessage[]
  addMessage: (content: string, role: "function" | "user" | "system" | "assistant", sender: string) => Promise<void>
  isLoadingAnswer: boolean
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children, correctAnswer }: { children: ReactNode, correctAnswer: string }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const router = useRouter();
  const { question, answer } = router.query;

  useEffect(() => {
    const initializeChat = async () => {
      const systemMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: 'system',
        content: 'You are a AI tutor backed by a large language model. You acting as a Nigerian tutor to educate Nigerian students. Speak in the simplest possible English that you can. Explain answers to people step by step.'
      }
      const welcomeMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: 'assistant',
        content: `This question was: "${question}"<br/><br/>Your answer was: ${answer}<br/><br/><strong class="font-bold">The correct answer was: ${correctAnswer}</strong><br/><br/>I'm your tutor, how can I help you?`
      }
      setMessages([systemMessage, welcomeMessage])
    }
  
    if (!messages?.length && question && answer) {
      initializeChat()
    }
  }, [messages?.length, setMessages, question, answer])

  const addMessage = async (content: string, role: "function" | "user" | "system" | "assistant", sender: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role,
        content
      }
      const newMessages = [...messages, newMessage]

      // Add the message to the state
      setMessages(newMessages)

      if (role === 'user') {
        const { data } = await sendMessage(newMessages.map(message => ({ role: message.role, content: message.content })))
        const assistantContent = data.choices[0].message.content

        const assistantMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
          role: 'assistant',
          content: assistantContent
        }

        // Add the assistant message to the state
        setMessages([...newMessages, assistantMessage])
      }

    } catch (error) {
      console.error('Error in addMessage:', error.message)
      console.error('Stack trace:', error.stack)
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