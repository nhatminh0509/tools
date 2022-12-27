import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const ShopServices = {
  getStakeBoxList() {
    const apiUrl = `/sale?typeNFTs=STAKE_BOX`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getStakeBoxList.name, cancelTokenHandlerObject)
  },
  getStakeBoxDetails(address, type) {
    const apiUrl = `/sale/${address}/${type}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getStakeBoxDetails.name, cancelTokenHandlerObject)
  },
  getListenList(page) {
    const apiUrl = `/sale?typeNFTs=HEADPHONE&typeNFTs=PLAYER&typeNFTs=DISC&page=${page}&direction=asc&limit=12`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getListenList.name, cancelTokenHandlerObject)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(ShopServices)

export default ShopServices
