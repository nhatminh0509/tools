/* eslint-disable no-undef */
import ReduxService from '../Redux/redux'
import WalletConnect from '@walletconnect/client'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'
import { getDataLocal, removeDataLocal, saveDataLocal } from '../../common/function'
import { OBSERVER_KEY, WALLET_CONNECT_APP } from '../../common/constants'
import Observer from '../../common/observer'
import { convertUtf8ToHex } from '@walletconnect/utils'
import { isMobile } from 'react-device-detect'
import { setConnectionMethod } from '../Redux/slice/appSlice'

const DEFAULT_BRIDGE = 'https://bridge.keyringpro.com'
const INITIAL_STATE = {
  connector: null,
  connected: false,
  chainId: 0,
  accounts: [],
  address: '',
  session: {},
}
let connector

export default class WalletConnectServices {
  static async initialize(prevConnector = null, isMobile = false) {
    try {
      if (prevConnector) {
        let oldSession = getDataLocal('wallet_connect_session')
        connector = new WalletConnect({ session: oldSession || prevConnector.session, bridge: DEFAULT_BRIDGE })
      } else {
        if (isMobile) {
          connector = new WalletConnect({
            bridge: DEFAULT_BRIDGE,
            session: INITIAL_STATE.session,
          })
        } else {
          connector = new WalletConnect({
            bridge: DEFAULT_BRIDGE,
            qrcodeModal: WalletConnectQRCodeModal,
            session: INITIAL_STATE.session,
          })
        }
      }

      ReduxService.updateWalletConnect({ connector: JSON.parse(JSON.stringify(connector)) })

      if (!connector.connected) {
        await connector.createSession({ chainId: ReduxService.getChainConnected() })
      } else {
        const { accounts, chainId, peerMeta } = connector
        this.onConnect(connector, accounts, chainId, peerMeta)
      }

      this.subscribeToEvents()

      return connector
    } catch (error) {
      console.log('walletconnect initialize', error)
    }
  }

  static async refresh(isMobile = false) {
    let walletConnect = ReduxService.getWalletConnect()
    const prevConnector = walletConnect.connector
    this.initialize(prevConnector, isMobile)
  }

  static subscribeToEvents() {
    if (!connector) {
      return
    }

    connector.on('session_update', (error, payload) => {
      console.log('session_update', error, payload)
      if (error) {
        throw error
      }

      // get updated accounts and chainId
      const { accounts, chainId } = payload.params[0]
      this.onSessionUpdate(accounts, chainId)
    })

    connector.on('session_request', (error, payload) => {
      console.log('session_request', error, payload)
      if (error) {
        throw error
      }
    })

    connector.on('connect', (error, payload) => {
      console.log('connect', error, payload)
      if (error) {
        throw error
      }

      // get updated accounts and chainId
      const { accounts, chainId, peerMeta } = payload.params[0]
      this.onConnect(connector, accounts, chainId, peerMeta)
      saveDataLocal('wallet_connect_session', connector.session)
    })

    connector.on('disconnect', (error, payload) => {
      console.log('disconnect', error, payload)
      if (error) {
        throw error
      }

      // delete connector
      this.onDisconnect()
    })
  }

  static onSessionUpdate(accounts, chainId) {
    const address = accounts[0]
    ReduxService.updateWalletConnect({
      chainId,
      accounts,
      address,
    })
  }

  static onDisconnect() {
    this.resetApp()
  }

  static resetApp() {
    // update redux state
    ReduxService.updateWalletConnect(INITIAL_STATE)
    ReduxService.resetUser()
    Observer.emit(OBSERVER_KEY.CHANGED_ACCOUNT)
    ReduxService.callDispatchAction(setConnectionMethod(''))
    removeDataLocal('wallet_connect_session')
  }

  static killSession = () => {
    if (connector) {
      connector.killSession()
    }
    this.resetApp()
  }

  static formatIOSMobile = (uri, entry) => {
    const encodedUri = encodeURIComponent(uri)
    return entry.universalLink
      ? `${entry.universalLink}/wc?uri=${encodedUri}`
      : entry.deepLink
      ? `${entry.deepLink}${entry.deepLink.endsWith(':') ? '//' : '/'}wc?uri=${encodedUri}`
      : ''
  }

  static deeplinkOpenApp = () => {
    const walletConnect = ReduxService.getWalletConnect()
    if (isMobile && walletConnect.appConnected) {
      if (walletConnect.appConnected.name.startsWith('KEYRING')) {
        window.open(walletConnect.appConnected.universalLink + '/wc?uri=wc:' + walletConnect.session.handshakeTopic + '@1', '_blank')
      } else {
        window.open(WalletConnectServices.formatIOSMobile(walletConnect.connector.uri, walletConnect.appConnected), '_blank')
      }
    }
  }

  static async onConnect(connector, accounts, chainId, peerMeta) {
    const address = accounts[0]
    const { name } = peerMeta
    const appConnected = WALLET_CONNECT_APP.find((item) => item.name.toLowerCase().startsWith(name?.toLowerCase()))
    const callbackSignIn = () => {
      Observer.emit(OBSERVER_KEY.ALREADY_SIGNED)
    }

    await ReduxService.updateWalletConnect({
      connector,
      connected: true,
      chainId,
      accounts,
      address,
      session: connector.session,
      appConnected,
    })
    ReduxService.loginWalletConnect(callbackSignIn, null, false)
  }

  static sendTransaction(tx) {
    let walletConnect = ReduxService.getWalletConnect()
    const { connector } = walletConnect
    if (!(connector && connector.connected)) {
      this.killSession()
      return
    }

    return new Promise((resolve, reject) => {
      // Sign transaction
      connector
        .sendTransaction(tx)
        .then((result) => {
          // Returns signed transaction
          return resolve(result)
        })
        .catch((error) => {
          // Error returned when rejected
          return reject(error)
        })
    })
  }

  static signPersonalMessage(message, address) {
    let walletConnect = ReduxService.getWalletConnect()
    const { connector } = walletConnect
    if (!(connector && connector.connected)) {
      this.killSession()
      return
    }
    const msgParams = [convertUtf8ToHex(message), address]

    return new Promise((resolve, reject) => {
      // Sign transaction
      connector
        .signPersonalMessage(msgParams)
        .then((result) => {
          // Returns signed transaction
          return resolve(result)
        })
        .catch((error) => {
          // Error returned when rejected
          return reject(error)
        })
    })
  }

  static switchChain(chainId) {
    const chain = CHAIN_RPC_DATA[chainId]
    let walletConnect = ReduxService.getWalletConnect()
    const { connector } = walletConnect
    if (!connector) {
      return
    }
    return new Promise((resolve, reject) => {
      // Sign transaction
      console.log(connector)
      const requestData = '0x'
      const additionalData = {
        type: 'CONFIRM_CHANGE_NETWORK',
      }
      const customRequest = {
        id: new Date().getTime(),
        jsonrpc: '2.0',
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: chain.chainId,
            data: prepareDataForWalletConnect(requestData, additionalData),
          },
        ],
      }
      connector
        .sendCustomRequest(customRequest)
        .then((result) => {
          // Returns signed transaction
          console.log(result)
          ReduxService.callDispatchAction(StorageActions.setChainConnected(chainId))
          return resolve(result)
        })
        .catch((error) => {
          // Error returned when rejected
          console.log(error)
          return reject(error)
        })
    })
  }
}
