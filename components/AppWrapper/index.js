import React, { useEffect } from 'react'
import useInitialData from '@/hooks/useInitialData'
import Head from 'next/head'
import { ToastContainer } from 'react-toastify'
import styled from 'styled-components'
import MyModal from '../MyModal'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import Loading from '../Loading'
import { useRouter } from 'next/router'
import { setLoadingGlobal } from '@/controller/Redux/slice/appSlice'
import { getDataLocal } from '@/common/function'

const Wrapper = styled.div`
  min-height: 100vh;
  min-width: 100vw;
`

const AppBackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${(props) => props.zIndex || 10};
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6ff;
`

const AppWrapper = ({ children }) => {
  useInitialData()
  const { setting } = useSelector((state) => state.app)
  const { loading } = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    const onLoading = () => {
      dispatch(setLoadingGlobal(true))
    }
    const offLoading = () => {
      dispatch(setLoadingGlobal(false))
    }
    router.events.on('routeChangeStart', onLoading)
    router.events.on('routeChangeComplete', offLoading)

    return () => {
      router.events.off('routeChangeStart', onLoading)
      router.events.off('routeChangeComplete', offLoading)
    }
  }, [])

  return (
    <Wrapper>
      <Head>
        <link rel='shortcut icon' id='my-favicon' href='/logo.png' />
        <title>Holders & Transfer</title>
      </Head>
      {setting && setting.appMaintenance && !getDataLocal('dev') ? (
        <AppBackgroundWrapper>
          <h1 style={{ color: 'white' }}>App Maintenance</h1>
        </AppBackgroundWrapper>
      ) : (
        children
      )}
      {loading && (
        <AppBackgroundWrapper>
          <Loading width={180} height={180} />
        </AppBackgroundWrapper>
      )}
      <MyModal />
      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </Wrapper>
  )
}

export default AppWrapper
