import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const MarketplaceServices = {
  getMarkets(query) {
    let apiUrl = `/market`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getMarketplaceOrders.name, null, query, null)
  },
  getMarketplaceOrders(paymentToken, seller) {
    let apiUrl = `/market`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getMarketplaceOrders.name, cancelTokenHandlerObject, { paymentToken, seller }, null)
  },
  getMarketplaceOrderDetails(orderId) {
    const apiUrl = `/market/${orderId}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getMarketplaceOrderDetails.name, cancelTokenHandlerObject)
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(MarketplaceServices)

export default MarketplaceServices
