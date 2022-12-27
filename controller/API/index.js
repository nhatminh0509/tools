import axiosInstance from './instance'
import QueryString from 'query-string'
import ReduxService from '../Redux/redux'
import Web3Service from '../Web3'
import { showNotificationError } from '@/common/function'

export default class APIService {
  static async request(method, apiUrl, name, cancelTokenHandlerObject, query, body, token = null) {
    const AUTH_TOKEN = token || ReduxService.getBearerToken()
    let url = apiUrl
    if (query) {
      url = url + '?' + QueryString.stringify(query)
    }
    let config = {
      method,
      url,
    }
    if (cancelTokenHandlerObject) {
      config.cancelToken = cancelTokenHandlerObject[name].handleRequestCancellation().token
    }
    if (AUTH_TOKEN) {
      config.headers = {
        Authorization: AUTH_TOKEN,
      }
    }
    if (body) {
      config.data = body
    }
    return axiosInstance
      .request(config)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        if (error?.response?.status === 403) {
          showNotificationError('Your session has expired. Please sign in again to continue')
          Web3Service.logout()
        } else if (!error?.message?.includes('canceled')) {
          showNotificationError(error?.response.data.error)
        }
        return null
      })
  }
}
