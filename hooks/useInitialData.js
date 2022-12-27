import ReduxService from '@/controller/Redux/redux'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { KEY_STORE } from '../common/constants'
import { getDataLocal } from '../common/function'
import { setChainConnected, setConnectionMethod, setLoadingGlobal, setUserData } from '../controller/Redux/slice/appSlice'
import { store } from '../controller/Redux/store'
import useAuth from './useAuth'

const initDataLocal = [
  { key: KEY_STORE.SET_CONNECTION_METHOD, action: setConnectionMethod },
  { key: KEY_STORE.SET_USER, action: setUserData },
  { key: KEY_STORE.SET_CHAIN_CONNECTED, action: setChainConnected },
]

const useInitialData = () => {
  const { isSigned } = useAuth()
  const dispatch = useDispatch()
  useEffect(() => {
    const getData = async () => {
      dispatch(setLoadingGlobal(true))
      initDataLocal.map((item) => {
        let dataLocal = getDataLocal(item.key)
        if (dataLocal) {
          store.dispatch(item.action(dataLocal))
        }
      })
      await ReduxService.detectConnectionMethod()
      dispatch(setLoadingGlobal(false))
    }

    getData()
  }, [dispatch])

  useEffect(() => {
    const refreshBalance = async () => {
      await ReduxService.refreshUserBalance()
    }
    if (isSigned) {
      refreshBalance()
    }
  }, [isSigned])
}

export default useInitialData
