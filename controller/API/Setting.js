import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const SettingService = {
  getSetting(key = 'contract') {
    const apiUrl = `/setting/${key}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getSetting.name, cancelTokenHandlerObject)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(SettingService)

export default SettingService
