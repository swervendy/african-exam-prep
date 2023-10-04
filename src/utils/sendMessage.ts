import OpenAI from 'openai'

export const sendMessage = async (messages: OpenAI.Chat.CreateChatCompletionRequestMessage[]) => {
  try {
    // Check if the last user message is a request for a step-by-step explanation
    const lastUserMessage = messages[messages.length - 1]
    if (lastUserMessage.role === 'user' && lastUserMessage.content.toLowerCase().includes('step-by-step explanation')) {
      // Modify the user's message to include a specific prompt for a step-by-step explanation
      lastUserMessage.content = `Please provide a step-by-step explanation for the following: ${lastUserMessage.content.replace('step-by-step explanation', '')}`
    }

    const response = await fetch('/api/createMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages })
    })

    return await response.json()
  } catch (error) {
    console.log(error)
  }
}