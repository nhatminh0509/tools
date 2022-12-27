import React from 'react'
import '../styles/globals.scss'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { store } from '../controller/Redux/store'
import AppWrapper from '@/components/AppWrapper'
import { QueryClientProvider, QueryClient } from 'react-query'
import ClientRender from '@/components/ClientRender'
import MainLayout from '@/components/MainLayout'

function MyApp({ Component, pageProps }) {
  const Layout = Component.Layout || MainLayout
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  })

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <AppWrapper>
          <ClientRender>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ClientRender>
        </AppWrapper>
      </Provider>
    </QueryClientProvider>
  )
}

export default MyApp
