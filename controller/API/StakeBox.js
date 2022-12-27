import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const StakeBoxService = {
  getStake(userAddress) {
    const apiUrl = `/stake-box/${userAddress}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getStake.name, cancelTokenHandlerObject)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(StakeBoxService)

export default StakeBoxService
