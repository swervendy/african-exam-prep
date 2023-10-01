import { NextPage } from 'next'
import { MessagesProvider } from '../utils/useMessages'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import ErrorBoundary from '../components/ErrorBoundary'

const IndexPage: NextPage = () => {
  return (
    <MessagesProvider>
      <Layout>
        <ErrorBoundary>
          {/* MessagesList and MessageForm components are already included in Layout, so they are not needed here */}
        </ErrorBoundary>
      </Layout>
    </MessagesProvider>
  )
}

export default IndexPage