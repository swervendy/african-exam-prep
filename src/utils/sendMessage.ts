import OpenAI from 'openai'
import va from '@vercel/analytics' // Add this line

export const sendMessage = async (messages: OpenAI.Chat.CreateChatCompletionRequestMessage[]) => {
  try {
    const response = await fetch('/api/createMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    va.track('Message Sent') // Add this line to track the event

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}