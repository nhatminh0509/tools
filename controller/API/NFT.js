import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const NFTService = {
  getList(query) {
    const apiUrl = `/nft`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getList.name, cancelTokenHandlerObject, query, null)
  },
  getListGroup(query) {
    const apiUrl = `/nft/group`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getListGroup.name, cancelTokenHandlerObject, query, null)
  },
  getNFTDetail(address, id) {
    const apiUrl = `/nft/${address}/${id}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl)
  },
  getNFTDetailGroup(address, id) {
    const apiUrl = `/nft/group/${address}/${id}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl)
  },
  getDataUnbox(query) {
    const apiUrl = `/nft/unbox`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getDataUnbox.name, cancelTokenHandlerObject, query, null)
  },
  unbox(body) {
    const apiUrl = `/nft/unbox`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.unbox.name, cancelTokenHandlerObject, null, body)
  },
  toggleSelect(body) {
    const apiUrl = `/nft/toggle-select-stake`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.toggleSelect.name, cancelTokenHandlerObject, null, body)
  },
  toggleActivePlayer(body) {
    const apiUrl = `/nft/toggle-active-player`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.toggleSelect.name, cancelTokenHandlerObject, null, body)
  },
  toggleActiveHeadphone(body) {
    const apiUrl = `/nft/toggle-active-headphone`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.toggleSelect.name, cancelTokenHandlerObject, null, body)
  },
  mountDisc(body) {
    const apiUrl = `/nft/mount-disc`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.toggleSelect.name, cancelTokenHandlerObject, null, body)
  },
  unMountDisc(body) {
    const apiUrl = `/nft/unmount-disc`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.toggleSelect.name, cancelTokenHandlerObject, null, body)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(NFTService)

export default NFTService
