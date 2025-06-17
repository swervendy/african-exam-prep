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

export function MessagesProvider({ children, correctAnswer, source }: { children: ReactNode, correctAnswer: string, source: string }) {
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
        content: source === 'home'
          ? 'Drop your JAMB questions into the text box below and I\'ll provide an explanation of the right answer'
          : `This question was: "${question}". Your answer was: ${answer}. The correct answer was: ${correctAnswer}. I'm your tutor, how can I help you?`
      }
      setMessages([systemMessage, welcomeMessage])

      // Store the welcome message in the database
      await fetch('/api/storeConversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionID: localStorage.getItem('sessionID'), role: welcomeMessage.role, content: welcomeMessage.content, sender: 'assistant' })
      })
    }

    if (!messages?.length && (question && answer || source === 'home')) {
      initializeChat()
    }
  }, [messages?.length, question, answer, source])

  const addMessage = async (content: string, role: "function" | "user" | "system" | "assistant", sender: string) => {
    setIsLoadingAnswer(true)
    try {
      const newMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role,
        content
      }
      setMessages(prev => [...prev, newMessage]); // Add the user's message immediately
  
      if (role === 'user') {
        const { data } = await sendMessage([...messages, newMessage].map(message => ({ role: message.role, content: message.content })))
        const assistantContent = data.choices[0].message.content
  
        const assistantMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
          role: 'assistant',
          content: assistantContent
        }
  
        setMessages(prev => [...prev, assistantMessage]); // Add the assistant's message to the state
        setIsLoadingAnswer(false)
  
        // Store the assistant message in the database
        await fetch('/api/storeConversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionID: localStorage.getItem('sessionID'), role: 'assistant', content: assistantContent, sender: 'assistant' })
        })
      } else {
        // Add the message to the state
        setMessages(prev => [...prev, newMessage]);
  
        setIsLoadingAnswer(false)
  
        // Store the message in the database
        await fetch('/api/storeConversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionID: localStorage.getItem('sessionID'), role, content, sender })
        })
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