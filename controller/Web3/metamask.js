/* eslint-disable no-undef */
import ReduxService from '../Redux/redux'
import MetaMaskOnboarding from '@metamask/onboarding'
import { isMobile } from 'react-device-detect'
import { CHAIN_DATA, OBSERVER_KEY } from '../../common/constants'
import { destroyNotification, showNotification } from '../../common/function'
import { convertUtf8ToHex } from '@walletconnect/utils'
import Observer from '../../common/observer'
import { setChainConnected } from '../Redux/slice/appSlice'

let onboarding
export default class MetamaskServices {
  static async initialize() {
    try {
      if (!onboarding) {
        onboarding = new MetaMaskOnboarding()
      }

      if (!MetaMaskOnboarding.isMetaMaskInstalled() && !isMobile) {
        onboarding.startOnboarding()
      } else {
        onboarding.stopOnboarding()
        let accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        if (accounts.length > 0) {
          this.onConnect(accounts)
          this.subscribeToEvents()
        } else {
          let accounts = await this.enableMetaMask()
          this.onConnect(accounts)
          this.subscribeToEvents()
        }
      }
    } catch (error) {
      console.log('metamask => initialize', error)
    }
  }

  static async refresh() {
    try {
      const { accounts } = ReduxService.getMetaMask()
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_accounts' }).then(this.handleNewAccounts).then(this.subscribeToEvents())
        this.getNetworkAndChainId()
      } else if (accounts && accounts.length > 0) {
        this.onConnect(accounts)
        this.subscribeToEvents()
      }
    } catch (error) {
      console.lop('metamask refresh', error)
    }
  }

  static subscribeToEvents() {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum.on('chainChanged', this.handleNewChain)
      // window.ethereum.on('networkChanged', this.handleNewNetwork)
      window.ethereum.on('accountsChanged', this.handleNewAccounts)
    }
  }

  static async getNetworkAndChainId() {
    try {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      })
      let acceptChainData = CHAIN_DATA[ReduxService.getChainConnected()]
      if (chainId === acceptChainData.chainId) {
        this.handleNewChain(chainId)
      } else {
        destroyNotification()
        showNotification(`Wrong network! Please switch chain to ${acceptChainData.chainName}`)
        await this.addNewChain(ReduxService.getChainConnected())
        // Reload page
        window.location.reload()
      }

      const networkId = await window.ethereum.request({
        method: 'net_version',
      })
      this.handleNewNetwork(networkId)
    } catch (error) {
      console.log('metamask getNetworkAndChainId', error)
    }
  }

  static handleNewChain(chainId) {
    let acceptChainData = CHAIN_DATA[ReduxService.getChainConnected()]
    if (chainId === acceptChainData.chainId) {
      ReduxService.updateMetamask({
        chainId,
      })
    } else {
      destroyNotification()
      showNotification(`Wrong network! Please switch chain to ${acceptChainData.chainName}`)
    }
  }

  static handleNewNetwork(networkId) {
    ReduxService.updateMetamask({
      network: networkId,
    })
  }

  static handleNewAccounts(accounts) {
    const address = accounts[0]
    ReduxService.updateMetamask({
      accounts,
      address,
    })
  }

  static async addNewChain(chainId) {
    let chainData = CHAIN_DATA[parseInt(chainId)]
    if (chainData && MetaMaskOnboarding.isMetaMaskInstalled()) {
      return new Promise((resolve, reject) => {
        window.ethereum
          .request({ method: 'wallet_addEthereumChain', params: [chainData] })
          .then((result) => {
            return resolve(result)
          })
          .catch((error) => {
            return reject(error)
          })
      })
    } else {
      return null
    }
  }

  static signPersonalMessage(address, message) {
    const msgParams = [convertUtf8ToHex(message), address]
    if (window.ethereum) {
      return new Promise((resolve, reject) => {
        window.ethereum
          .request({ method: 'personal_sign', params: msgParams })
          .then((result) => {
            return resolve(result)
          })
          .catch((error) => {
            return reject(error)
          })
      })
    } else {
      return null
    }
  }

  static async onConnect(accounts) {
    const address = accounts[0]
    const callbackSignIn = () => {
      Observer.emit(OBSERVER_KEY.ALREADY_SIGNED)
    }
    await this.getNetworkAndChainId()
    await ReduxService.updateMetamask({
      accounts,
      address,
    })
    ReduxService.loginMetamask(callbackSignIn, null, false)
  }

  static async switchNetworks(networkId) {
    const chain = CHAIN_DATA[networkId]
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chain.chainId }],
      })
      ReduxService.callDispatchAction(setChainConnected(networkId))
    } catch (error) {
      if (error.code === 4902 && networkId !== undefined) {
        await this.addNewChain(networkId)
      }
      console.log('metamask - switch network', error)
    }
  }
}
