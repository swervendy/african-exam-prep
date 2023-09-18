import { Button, TextArea } from '@apideck/components'
import { useState } from 'react'
import { useMessages } from '../utils/useMessages'
import React from 'react';

const MessageForm = () => {
  const [content, setContent] = useState('')
  const { addMessage } = useMessages()

  const handleSubmit = async (e?: any) => {
    e?.preventDefault()
    addMessage(content)
    setContent('')
  }

  return (
    <form className="relative mx-auto max-w-3xl rounded-t-xl" onSubmit={handleSubmit}>
      <div className=" border-gray-200 h-[130px] rounded-t-xl backdrop-blur border-t border-l border-r border-gray-500/10 dark:border-gray-50/[0.06] bg-white supports-backdrop-blur:bg-white/95 p-5">
        <label htmlFor="content" className="sr-only">
          Your message
        </label>
        <TextArea
          name="content"
          placeholder="Enter your message here..."
          rows={3}
          value={content}
          autoFocus
          className="!p-3 text-gray-900 border-0 ring-1 dark:ring-0 ring-gray-300/40 focus:ring-gray-300/80 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800/80 backdrop-blur shadow-none"
          onChange={(e: any) => setContent(e.target.value)}
        />
        <div className="absolute right-8 bottom-10">
          <div className="flex space-x-3">
          <Button className="inline-flex items-center justify-center border border-transparent leading-4 font-medium rounded transition duration-300 ease-in-out whitespace-nowrap bg-primary-600 text-white shadow hover:shadow-md active:bg-primary-600 hover:bg-primary-700 focus:shadow-outline-primary dark:hover:bg-primary-500 px-2.5 py-1.5 text-xs bg-indigo-500 !important" type="submit">
            Send
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4 ml-1 inline-block">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"></path>
            </svg>
          </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default MessageForm
