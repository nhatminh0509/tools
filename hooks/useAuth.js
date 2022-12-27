/* eslint-disable no-unused-vars */
import ReduxService from '@/controller/Redux/redux'
import { useSelector } from 'react-redux'

const useAuth = () => {
  const isSigned = ReduxService.checkIsSigned()
  const { userData, metamask, walletConnect } = useSelector((state) => state.app)
  return {
    isSigned,
    userAddress: isSigned ? userData?.address : null,
    token: isSigned ? userData?.token : null,
    role: isSigned ? userData?.role : null,
  }
}

export default useAuth
