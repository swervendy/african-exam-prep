import { NextPage } from 'next'
import { MessagesProvider } from '../utils/useMessages'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import ErrorBoundary from '../components/ErrorBoundary'

const TutorPage: NextPage = () => {
  const router = useRouter();
  const { question, answer, correctAnswer } = router.query;

  return (
    <MessagesProvider correctAnswer={correctAnswer as string} source={router.query.source as string}>
      <Layout>
        <ErrorBoundary>
          {/* MessagesList and MessageForm components are already included in Layout, so they are not needed here */}
        </ErrorBoundary>
      </Layout>
    </MessagesProvider>
  )
}

export default TutorPage