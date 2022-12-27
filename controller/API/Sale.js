import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const SaleBoxService = {
  getList(query) {
    const apiUrl = `/sale`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getList.name, cancelTokenHandlerObject, query, null, true)
  },
  create(body) {
    const apiUrl = `/sale`
    return APIService.request(REQUEST_TYPE.POST, apiUrl, this.create.name, cancelTokenHandlerObject, null, body)
  },
  update(id, body) {
    const apiUrl = `/sale/${id}`
    return APIService.request(REQUEST_TYPE.PUT, apiUrl, this.update.name, cancelTokenHandlerObject, null, body)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(SaleBoxService)

export default SaleBoxService
