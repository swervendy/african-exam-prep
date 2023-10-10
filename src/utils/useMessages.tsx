import { useToast } from '@apideck/components'
import OpenAI from 'openai'
import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { sendMessage } from './sendMessage'
import { useRouter } from 'next/router';

interface ContextProps {
  messages: OpenAI.Chat.CreateChatCompletionRequestMessage[]
  addMessage: (content: string, role: "function" | "user" | "system" | "assistant", sender: string) => Promise<void>
  isLoadingAnswer: boolean
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
}

const ChatsContext = createContext<Partial<ContextProps>>({})

export function MessagesProvider({ children, correctAnswer }: { children: ReactNode, correctAnswer: string }) {
  const { addToast } = useToast()
  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([])
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false)
  const router = useRouter();
  const { question, answer } = router.query;
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('normal');

  const sampleExplanation = `{
    "name": "closing_stock_calculation",
    "description": "A function that provides a step-by-step explanation on how to determine the closing stock.",
    "introduction": {
        "title": "Introduction",
        "description": "Sure, I'll be happy to explain step by step how to solve the equation \"32y - 6(3y) = 27\" to find the value of y."
    },
    "steps": [
          {
              "step_number": 1,
              "title": "Understand what closing stock means",
              "description": "Closing stock refers to the value of unsold goods or products at the end of an accounting period, such as a month or a year."
          },
          {
              "step_number": 2,
              "title": "Gather information",
              "description": "To determine the closing stock, you need to have certain information available. This includes: - The opening stock: The value of unsold goods at the beginning of the accounting period. - Purchases: The value of new stock purchases made during the accounting period. - Sales: The value of goods sold during the accounting period."
          },
          {
              "step_number": 3,
              "title": "Calculate the cost of goods available for sale",
              "description": "Add the opening stock and the value of purchases during the accounting period. This will give you the total cost of goods available for sale."
          },
          {
              "step_number": 4,
              "title": "Determine the cost of goods sold",
              "description": "Subtract the value of goods sold during the accounting period from the total cost of goods available for sale. This will give you the cost of goods sold."
          },
          {
              "step_number": 5,
              "title": "Calculate the closing stock",
              "description": "Subtract the cost of goods sold from the cost of goods available for sale. This will give you the value of the closing stock."
          },
          {
              "step_number": 6,
              "title": "Example calculation",
              "description": "Let's say the opening stock is N 3,000, purchases are N 8,000, and the sales are N 6,500. We can calculate the closing stock as follows: - Cost of goods available for sale = opening stock + purchases = N 3,000 + N 8,000 = N 11,000 - Cost of goods sold = sales = N 6,500 - Closing stock = cost of goods available for sale - cost of goods sold = N 11,000 - N 6,500 = N 4,500 Therefore, the closing stock in this example is N 4,500. Remember, this is a simplified explanation. In real accounting scenarios, there might be additional considerations and calculations involved."
          }
      ],
      "conclusion": {
          "title": "Final Thoughts",
          "description": "Calculating the closing stock is crucial for understanding the financial health of a business. It helps in determining the value of unsold inventory and provides insights into sales performance and inventory management. Always ensure to use accurate data for calculations and consider all relevant factors to get a precise closing stock value."
      }
  }
}`;

  useEffect(() => {
    console.log('Current mode:', mode);
  }, [mode]);
  
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
  
      // Store the welcome message in the database
      await fetch('/api/storeMessage', {
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
  
      // Store the message in the database
      await fetch('/api/storeMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionID: localStorage.getItem('sessionID'), role, content, sender })
      })
  
      if (role === 'user') {
        // Modify the message sent to OpenAI based on the current mode
        let openAiContent = content;
        if (mode === 'step-by-step') {
          openAiContent = `Given the following answer explanation you have given to a student: ${content}\n\nPlease provide a structured explanation to the student in the exact format:\n${sampleExplanation}`;
          console.log("Sending the following content to OpenAI:", openAiContent); // Log the message sent to OpenAI
        }
  
        const { data } = await sendMessage(newMessages.map(message => ({ role: message.role, content: message.content })))
        const assistantContent = data.choices[0].message.content
  
        const assistantMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
          role: 'assistant',
          content: assistantContent
        }
  
        // Store the assistant message in the database
        await fetch('/api/storeMessage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sessionID: localStorage.getItem('sessionID'), role: assistantMessage.role, content: assistantMessage.content, sender: 'assistant' })
        })
  
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
    <ChatsContext.Provider value={{ messages, addMessage, isLoadingAnswer, mode, setMode }}>
      {children}
    </ChatsContext.Provider>
  )
}

export const useMessages = () => {
  return useContext(ChatsContext) as ContextProps
}
