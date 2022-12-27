import { createSlice } from '@reduxjs/toolkit'
// import { isMobile } from 'react-device-detect'
import { KEY_STORE } from '../../../common/constants'
import { saveDataLocal } from '../../../common/function'

const initialState = {
  loading: false,
  modal: null,
  metamask: {
    network: 0,
    accounts: [],
    address: '',
  },
  walletConnect: {
    connector: {},
    chainId: 0,
    accounts: [],
    address: '',
    session: {},
    appConnected: null,
  },
  userBalance: {
    balance: 0,
  },
  userData: null,
  connectionMethod: null,
  setting: {},
  acceptToken: null,
  chainConnected: 97,
  sidebar: false,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setMetamask: (state, action) => {
      state.metamask = action.payload
    },
    setWalletConnect: (state, action) => {
      state.walletConnect = action.payload
    },
    setBalance: (state, action) => {
      state.userBalance = action.payload
    },
    setUserData: (state, action) => {
      saveDataLocal(KEY_STORE.SET_USER, action.payload)
      state.userData = action.payload
    },
    setChainConnected: (state, action) => {
      saveDataLocal(KEY_STORE.SET_CHAIN_CONNECTED, action.payload)
      state.chainConnected = Number(action.payload)
    },
    setConnectionMethod: (state, action) => {
      saveDataLocal(KEY_STORE.SET_CONNECTION_METHOD, action.payload)
      state.connectionMethod = action.payload
    },
    setLoadingGlobal: (state, action) => {
      state.loading = action.payload
    },
    setModal: (state, action) => {
      state.modal = action.payload
    },
    setSetting: (state, action) => {
      state.setting = action.payload
    },
    setAcceptToken: (state, action) => {
      state.acceptToken = action.payload.acceptToken
    },
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar
    },
  },
})

export const {
  setWalletConnect,
  setBalance,
  setMetamask,
  setUserData,
  setConnectionMethod,
  setSetting,
  setLoadingGlobal,
  setModal,
  setAcceptToken,
  toggleSidebar,
  setChainConnected,
} = appSlice.actions

export default appSlice.reducer
