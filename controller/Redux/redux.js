/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
import { CONNECTION_METHOD } from '../../common/constants'
import { lowerCase, showNotificationError } from '../../common/function'
import Setting from '../API/Setting'
import User from '../API/User'
import Web3Services from '../Web3'
import MetamaskServices from '../Web3/metamask'
import WalletConnectServices from '../Web3/walletconnect'
import { setBalance, setWalletConnect, setMetamask, setUserData, setSetting, setAcceptToken, setChainConnected, setConnectionMethod } from './slice/appSlice'
import { store } from './store'

export default class ReduxService {
  static async callDispatchAction(action) {
    store.dispatch(action)
  }

  static getMetaMask() {
    const { app } = store.getState()
    const { metamask } = app
    return metamask
  }

  static getBearerToken() {
    const userData = ReduxService.getUserData()
    if (ReduxService.checkIsSigned()) {
      return `Bearer ${userData.token}`
    } else {
      return null
    }
  }

  static getWalletConnect() {
    const { app } = store.getState()
    const { walletConnect } = app
    return walletConnect
  }

  static getConnectionMethod() {
    const { app } = store.getState()
    const { connectionMethod } = app
    return connectionMethod
  }

  static getUserData() {
    const { app } = store.getState()
    const { userData } = app
    return userData
  }

  static getChainConnected() {
    const { app } = store.getState()
    const { chainConnected } = app
    return Number(chainConnected)
  }

  static async updateUserData(data) {
    const userData = this.getUserData()
    const newUser = { ...userData, ...data }
    ReduxService.callDispatchAction(setUserData(newUser))
  }

  static async updateMetamask(data) {
    const metamask = this.getMetaMask()
    let newMetamask = { ...metamask, ...data }
    ReduxService.callDispatchAction(setMetamask(newMetamask))
  }

  static async updateWalletConnect(data) {
    const { app } = store.getState()
    const { walletConnect } = app
    let newWalletConnect = { ...walletConnect, ...data }
    ReduxService.callDispatchAction(setWalletConnect(newWalletConnect))
  }

  static resetUser() {
    ReduxService.callDispatchAction(setUserData(null))
    ReduxService.callDispatchAction(setConnectionMethod(''))
  }

  static async loginMetamask(callbackAfterLogin = null, callbackError = null, hasSign = false) {
    return new Promise(async (resolve, reject) => {
      const metamask = this.getMetaMask()
      let currentWeb3 = window.ethereum

      try {
        if (!currentWeb3) {
          showNotificationError('Install Metamask')
          return resolve(null)
        }

        const findNetwork = parseInt(ReduxService.getChainConnected())
        let network = findNetwork || 0
        if (parseInt(metamask.network) !== network) {
          showNotificationError(`Only Support network ${findNetwork}`)
          return resolve(null)
        }

        if (metamask.accounts) {
          let isSigned = ReduxService.checkIsSigned()
          if (!isSigned) {
            if (hasSign) {
              this.connectMetamaskWithSign(callbackAfterLogin, callbackError)
            } else {
              this.connectMetamaskWithOutSign(callbackAfterLogin, callbackError)
            }
          } else {
            callbackAfterLogin && callbackAfterLogin()
            return resolve(null)
          }
        } else {
          return resolve(null)
        }
      } catch (error) {
        callbackError && callbackError()
        return reject(error)
      }
    })
  }

  static connectMetamaskWithSign(callbackAfterLogin = null, callbackError = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const metamask = this.getMetaMask()
        const { message } = await User.getMessageHash(metamask.address)
        let signature = await MetamaskServices.signPersonalMessage(metamask.address, message ?? 'SIGN MESSAGE')
        if (signature) {
          let newMetaMask = Object.assign({}, metamask)
          console.log('new', newMetaMask)
          ReduxService.updateMetamask(newMetaMask)
          const resUserLogin = await User.signIn(`${signature}|${metamask.address}`)
          let newUserLogin = Object.assign({}, { ...resUserLogin.user, token: resUserLogin.token, address: metamask.address })
          ReduxService.updateUserData(newUserLogin)
          ReduxService.refreshUserBalance()
          callbackAfterLogin && callbackAfterLogin()
          return resolve()
        } else {
          showNotificationError('Active Metamask')
          ReduxService.callDispatchAction(setUserData({}))
          callbackError && callbackError()
          return reject()
        }
      } catch (error) {
        showNotificationError('Connect Metamask Error')
        reject(error)
      }
    })
  }

  static async connectMetamaskWithOutSign(callbackAfterLogin = null, callbackError = null) {
    return new Promise(async (resolve, reject) => {
      try {
        const metamask = this.getMetaMask()
        let newMetaMask = Object.assign({}, metamask)
        this.updateMetamask(newMetaMask)
        let newUserLogin = Object.assign({}, { address: metamask.address })
        ReduxService.updateUserData(newUserLogin)
        ReduxService.refreshUserBalance()
        callbackAfterLogin && callbackAfterLogin()
        return resolve()
      } catch (error) {
        showNotificationError('Connect Metamask Error')
        callbackError && callbackError()
        reject(error)
      }
    })
  }

  static async refreshUser() {
    const userData = this.getUserData()
    const isSigned = ReduxService.checkIsSigned()
    if (isSigned) {
      // Call api get user
      // let resUser = await HubService.getUserBySignatureHub(userData.sig)
      let resUser = { address: userData?.address }
      if (resUser && resUser.address) {
        let newUser = {
          ...userData,
          ...resUser,
        }
        ReduxService.callDispatchAction(setUserData(newUser))
        ReduxService.refreshUserBalance()
      } else {
        ReduxService.callDispatchAction(setUserData(null))
      }
    }
  }

  static async loginWalletConnect(callbackAfterLogin = null, callbackError = null, hasSign = false) {
    return new Promise(async (resolve, reject) => {
      const { app } = store.getState()
      const { walletConnect } = app
      try {
        if (!walletConnect.connector) {
          showNotificationError('Connect Wallet Error')
          return resolve(null)
        }

        const findNetwork = parseInt(ReduxService.getChainConnected())

        let netword = findNetwork || 0

        if (walletConnect.chainId !== netword) {
          showNotificationError(`Only support network ${netword}`)
          ReduxService.updateWalletConnect({ connected: false })
          walletConnect.connector.killSession()
          return resolve(null)
        }
        if (walletConnect.address) {
          let isSigned = ReduxService.checkIsSigned()
          if (!isSigned) {
            if (hasSign) {
              ReduxService.walletConnectWithSign(callbackAfterLogin, callbackError)
            } else {
              ReduxService.walletConnectWithoutSign(callbackAfterLogin, callbackError)
            }
          } else {
            callbackAfterLogin && callbackAfterLogin()
            return resolve(null)
          }
        } else {
          ReduxService.callDispatchAction(setUserData(null))
          return resolve(null)
        }
      } catch (error) {
        callbackError && callbackError()
        return reject(error)
      }
    })
  }

  static walletConnectWithoutSign = (callbackAfterLogin = null, callbackError = null) => {
    return new Promise(async (resolve, reject) => {
      const walletConnect = this.getWalletConnect()
      try {
        let newUserLogin = Object.assign({}, { address: walletConnect.address })
        ReduxService.updateUserData(newUserLogin)
        ReduxService.refreshUserBalance()
        callbackAfterLogin && callbackAfterLogin()
      } catch (error) {
        showNotificationError('Connect Wallet Error')
        callbackError && callbackError()
        reject(error)
      }
    })
  }

  static walletConnectWithSign = (callbackAfterLogin = null, callbackError = null) => {
    return new Promise(async (resolve, reject) => {
      const walletConnect = this.getWalletConnect()
      try {
        const address = walletConnect.address
        const { message } = await User.getMessageHash(address)
        if (confirm('Sign message')) {
          let signature = await WalletConnectServices.signPersonalMessage(message ?? 'SIGN MESSAGE', address)
          if (signature) {
            // let newUserLogin = Object.assign({}, { address: walletConnect.address, sig: signature })
            // TODO: Call api get user
            const resUserLogin = await User.signIn(`${signature}|${address}`)
            let newUserLogin = Object.assign({}, { ...resUserLogin.user, token: resUserLogin.token, address: address })
            ReduxService.updateUserData(newUserLogin)
            ReduxService.refreshUserBalance()
            callbackAfterLogin && callbackAfterLogin()
            return resolve()
          } else {
            if (window.localStorage.getItem('walletconnect')) {
              WalletConnectServices.killSession()
              showNotificationError('Connect Wallet Error')
            }
            ReduxService.callDispatchAction(setUserData({}))
            callbackError && callbackError()
            return resolve()
          }
        }
      } catch (error) {
        showNotificationError('Connect Wallet Error')
        reject(error)
      }
    })
  }

  static async refreshUserBalance() {
    const userData = this.getUserData()
    const isSigned = ReduxService.checkIsSigned()

    const balanceResult = {
      balance: 0,
    }
    if (isSigned) {
      const promiseResult = await Promise.all([Web3Services.getBalance(userData.address)])
      balanceResult.balance = promiseResult[0] || 0
    }

    ReduxService.callDispatchAction(setBalance({ ...balanceResult }))
  }

  static checkIsSigned() {
    const { app } = store.getState()
    const { metamask, pantograph, walletConnect, userData, connectionMethod } = app
    if (userData && userData.address) {
      switch (connectionMethod) {
        case CONNECTION_METHOD.METAMASK:
          return lowerCase(metamask.address) === lowerCase(userData.address)
        case CONNECTION_METHOD.PANTOGRAPH:
          return lowerCase(pantograph.account) === lowerCase(userData.address)
        case CONNECTION_METHOD.WALLET_CONNECT:
          return lowerCase(walletConnect.address) === lowerCase(userData.address)
        default:
          return false
      }
    }
    return false
  }

  static async detectConnectionMethod() {
    const { app } = store.getState()
    const { connectionMethod } = app
    switch (connectionMethod) {
      case CONNECTION_METHOD.METAMASK:
        await MetamaskServices.refresh()
        break
      case CONNECTION_METHOD.WALLET_CONNECT:
        WalletConnectServices.refresh()
        break
    }
  }

  static async getSettingContract() {
    const res = await Setting.getSetting('contract')
    if (res && res.value) {
      ReduxService.callDispatchAction(setSetting(res.value))
    }
  }

  static async getSettingToken() {
    const res = await Setting.getSetting('token')
    if (res && res.value) {
      ReduxService.callDispatchAction(setAcceptToken(res.value))
    }
  }

  static switchChain(chainId) {
    if (ReduxService.getConnectionMethod() === CONNECTION_METHOD.METAMASK) {
      MetamaskServices.switchNetworks(chainId)
    } else if (ReduxService.getConnectionMethod() === CONNECTION_METHOD.WALLET_CONNECT && ReduxService.getWalletConnect()?.connector?.connected) {
      WalletConnectServices.switchChain(chainId)
    } else {
      ReduxService.callDispatchAction(setChainConnected(chainId))
    }
  }
}
