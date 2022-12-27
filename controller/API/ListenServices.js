import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const ListenServices = {
  startListen(musicId, nftDiscAddress, nftDiscId) {
    const apiUrl = `/listen-to-earn/start`
    const body = {
      musicId,
      nftDiscAddress,
      nftDiscId,
    }
    return APIService.request(REQUEST_TYPE.POST, apiUrl, this.startListen.name, cancelTokenHandlerObject, null, body)
  },
  getRewards() {
    const apiUrl = `/listen-to-earn/rewards`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getRewards.name)
  },
  endListen(body) {
    const apiUrl = `/listen-to-earn/end`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.endListen.name, cancelTokenHandlerObject, null, body)
  },
  getMusicList(isShuffle = false) {
    let apiUrl = `/music?direction=desc`
    if (isShuffle) {
      apiUrl += '&shuffle=true'
    }
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getMusicList.name, cancelTokenHandlerObject)
  },
  getUserNFTList(userAddress) {
    const apiUrl = `/listen-to-earn?userAddress=${userAddress}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getUserNFTList.name, cancelTokenHandlerObject)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(ListenServices)

export default ListenServices
