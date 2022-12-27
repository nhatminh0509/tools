import { createCancelTokenHandler } from './utils'
import { REQUEST_TYPE } from 'common/constants'
import APIService from './index'

const UserService = {
  getMessageHash(address) {
    const apiUrl = `/users/getMessageHash/${address}`
    return APIService.request(REQUEST_TYPE.GET, apiUrl, this.getMessageHash.name, cancelTokenHandlerObject)
  },
  signIn(signature) {
    const apiUrl = `/auth/sign-in-with-signature`
    return APIService.request(REQUEST_TYPE.POST, apiUrl, this.signIn.name, cancelTokenHandlerObject, null, { signature })
  },
}

const cancelTokenHandlerObject = createCancelTokenHandler(UserService)

export default UserService
