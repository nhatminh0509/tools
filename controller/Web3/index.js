/* eslint-disable no-undef */
import { CHAIN_DATA, CONNECTION_METHOD, EXTRA_RATE_GAS, KEY_STORE } from '../../common/constants'
import { convertBalanceToWei, convertWeiToBalance, getDataLocal, randomNumber, roundingNumber } from '../../common/function'
import ReduxService from '../Redux/redux'
import converter from 'hex2dec'
import { Contract, ethers } from 'ethers'
import ABI from './abi'
import WalletConnectServices from './walletconnect'

export default class Web3Services {
  static createWeb3Provider() {
    let provider
    let walletConnect = ReduxService.getWalletConnect()
    const connectionMethod = getDataLocal(KEY_STORE.SET_CONNECTION_METHOD)
    if (connectionMethod === CONNECTION_METHOD.METAMASK && window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum)
    } else if (connectionMethod === CONNECTION_METHOD.WALLET_CONNECT && walletConnect && walletConnect.chainId !== 0) {
      provider = new ethers.providers.JsonRpcProvider(
        CHAIN_DATA?.[walletConnect.chainId]?.rpcUrls[randomNumber(0, CHAIN_DATA?.[walletConnect.chainId]?.rpcUrls?.length)]
      )
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        CHAIN_DATA?.[ReduxService.getChainConnected()]?.rpcUrls[randomNumber(0, CHAIN_DATA?.[ReduxService.getChainConnected()]?.rpcUrls?.length)]
      )
    }
    return provider
  }

  static logout() {
    const connectionMethod = getDataLocal(KEY_STORE.SET_CONNECTION_METHOD)
    if (connectionMethod === CONNECTION_METHOD.WALLET_CONNECT) {
      WalletConnectServices.killSession()
    } else {
      ReduxService.resetUser()
    }
  }

  static getSigner() {
    const provider = Web3Services.createWeb3Provider()
    return provider.getSigner()
  }

  static encodeABI(abi, method, param) {
    const iface = new ethers.utils.Interface(abi)
    const result = iface.encodeFunctionData(method, param)
    return result
  }

  static async getNonce(address) {
    const proviver = Web3Services.createWeb3Provider()
    return await proviver.getTransactionCount(address)
  }

  static async getGasPrice() {
    const provider = Web3Services.createWeb3Provider()
    const gasPrice = await provider.getGasPrice()
    return gasPrice
  }

  static async estimateGas(rawTransaction) {
    const provider = Web3Services.createWeb3Provider()
    const result = await provider.estimateGas(rawTransaction)
    return result
  }

  static async trackingTxs(hash, callbackSuccess, receipt) {
    if (receipt === undefined || receipt === null || receipt.blockNumber === null || receipt.blockNumber === undefined) {
      const provider = Web3Services.createWeb3Provider()
      const res = await provider.getTransactionReceipt(hash)
      if (!res) {
        setTimeout(() => Web3Services.trackingTxs(hash, callbackSuccess, res), 500)
      } else {
        callbackSuccess && callbackSuccess(res)
      }
    }
  }

  static async sendTransaction(fromAddress, transactionRequest, callbackError, callbackBeforeDone, callbackAfterDone) {
    try {
      const nonce = await Web3Services.getNonce(fromAddress)
      const gasPrice = await Web3Services.getGasPrice()
      let rawTransaction = {
        from: transactionRequest.from,
        to: transactionRequest.to,
        data: transactionRequest.data,
        nonce: ethers.utils.hexlify(nonce),
        gasPrice: ethers.utils.hexlify(gasPrice),
      }
      if (transactionRequest.value && transactionRequest.value > 0) {
        rawTransaction.value = converter.decToHex(`${transactionRequest.value}`)
      }
      const gas = await Web3Services.estimateGas(rawTransaction)
      const gasFinal = converter.decToHex(`${roundingNumber(gas * EXTRA_RATE_GAS, 0)}`) || gas
      rawTransaction.gasLimit = gasFinal
      const connectionMethod = ReduxService.getConnectionMethod()
      if (connectionMethod === CONNECTION_METHOD.WALLET_CONNECT) {
        console.log(rawTransaction)
        const res = await WalletConnectServices.sendTransaction(rawTransaction)
        if (res) {
          if (callbackBeforeDone) {
            callbackBeforeDone(res)
          }
          if (callbackAfterDone) {
            const callbackSuccess = (receipt) => {
              if (receipt && receipt.status && (receipt.status === true || receipt.status === 1)) {
                callbackAfterDone && callbackAfterDone(res)
              } else {
                callbackError && callbackError()
              }
            }
            Web3Services.trackingTxs(res, callbackSuccess)
          }
        }
      } else {
        const signer = await Web3Services.getSigner()
        const tx = await signer.sendTransaction(rawTransaction)
        callbackBeforeDone && callbackBeforeDone(tx)
        const txSuccess = await tx.wait()
        callbackAfterDone && callbackAfterDone(txSuccess)
        return txSuccess
      }
    } catch (error) {
      console.log('sendTransaction -> error', error)
      callbackError && callbackError(error)
    }
  }

  static async getBalance(address) {
    const provider = Web3Services.createWeb3Provider()
    const balance = await provider.getBalance(address)
    if (balance) {
      return convertWeiToBalance(balance)
    } else {
      return 0
    }
  }

  static async getTokenBalance(userAddress, tokenAddress, decimalToken = 18) {
    const provider = Web3Services.createWeb3Provider()
    const contract = new Contract(tokenAddress, ABI.token, provider)
    const result = await contract.balanceOf(userAddress)
    if (result && Number(result) !== 0) {
      return convertWeiToBalance(result, decimalToken)
    } else {
      return 0
    }
  }

  static async getTokenDecimals(contractAddress) {
    const provider = Web3Services.createWeb3Provider()
    const contract = new Contract(contractAddress, ABI.token, provider)
    const result = await contract.decimals()
    return Number(result?.toString())
  }

  static async needApprove(userAddress, spenderAddress, tokenAddress, amount, tokenDecimals = 18) {
    const provider = Web3Services.createWeb3Provider()
    const contract = new Contract(tokenAddress, ABI.token, provider)
    const allowanceWei = await contract.allowance(userAddress, spenderAddress)
    const allowance = convertWeiToBalance(allowanceWei?.toString(), Number(tokenDecimals))
    return Number(allowance) < Number(amount)
  }

  static async checkAllowance(userAddress, spenderAddress, tokenAddress, tokenDecimals = 18) {
    const provider = Web3Services.createWeb3Provider()
    const contract = new Contract(tokenAddress, ABI.token, provider)
    const result = await contract.allowance(userAddress, spenderAddress)
    if (result) {
      return convertWeiToBalance(result, tokenDecimals)
    } else {
      return 0
    }
  }

  static async getTokenName(tokenAddress) {
    try {
      const provider = Web3Services.createWeb3Provider()
      const contract = new Contract(tokenAddress, ABI.token, provider)
      const result = await contract.name()
      if (result) return result
      return null
    } catch (error) {
      return null
    }
  }

  static async approveTokenAmount(
    fromAddress,
    tokenAddress,
    spender,
    amount,
    tokenDecimals = 18,
    isApproveMax,
    callbackError,
    callbackBeforeDone,
    callbackAfterDone
  ) {
    try {
      const data = Web3Services.encodeABI(ABI.token, 'approve', [
        spender,
        isApproveMax ? '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' : convertBalanceToWei(amount, tokenDecimals),
      ])
      const transactionRequest = {
        from: fromAddress,
        to: tokenAddress,
        data,
      }
      return await Web3Services.sendTransaction(fromAddress, transactionRequest, callbackError, callbackBeforeDone, callbackAfterDone)
    } catch (error) {
      console.log(error)
      callbackError && callbackError(error)
      return null
    }
  }

  static async multiTransferToken(fromAddress, contractAddress, token, addresses, amounts, callbackError, callbackBeforeDone, callbackAfterDone) {
    console.log([token, addresses, amounts])
    try {
      const data = Web3Services.encodeABI(ABI.transfer, 'transferToken', [token, addresses, amounts])
      const transactionRequest = {
        from: fromAddress,
        to: contractAddress,
        data,
      }
      return await Web3Services.sendTransaction(fromAddress, transactionRequest, callbackError, callbackBeforeDone, callbackAfterDone)
    } catch (error) {
      console.log(error)
      callbackError && callbackError(error)
      return null
    }
  }
}
