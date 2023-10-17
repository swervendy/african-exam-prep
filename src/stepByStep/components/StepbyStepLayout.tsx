import Head from 'next/head'
import React, { useEffect, ReactNode } from 'react';
import MessageList from './StepbyStepMessageList'
import MessageForm from './StepbyStepMessageForm'
import { useMessages } from '../utils/useStepbyStepMessages'

type Props = {
  children: ReactNode
  title?: string
  description?: string
  favicon?: string
}

const Layout = ({
  children,
  title = 'JAMB CBT 2023 Practice - Master Your Exam with and AI Tutor and Past Questions',
  description = 'Get ahead with our JAMB CBT 2023 AI practice platform. Prepare for your exam with our interactive quizzes and AI tutor based on YOUR needs, unlimited. Study offline, track your progress, and ace your JAMB exam.',
  favicon = '/img/favicon.svg'
}: Props) => {
  
  return (
    <div className="font-basier-circle">
       <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href={favicon} />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="overflow-auto">
          <MessageList />
        </div>
        <div className="mt-auto w-full flex flex-col items-center">
          <div className="w-full pb-auto">
            <MessageForm />
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}

export default Layout
