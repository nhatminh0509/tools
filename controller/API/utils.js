import axios from 'axios'

const CancelToken = axios.CancelToken

export function createCancelTokenHandler(apiObject) {
  const cancelTokenHandler = {}
  Object.getOwnPropertyNames(apiObject).forEach((propertyName) => {
    const cancelTokenRequestHandler = {
      cancelToken: undefined,
    }
    cancelTokenHandler[propertyName] = {
      handleRequestCancellation: () => {
        cancelTokenRequestHandler.cancelToken && cancelTokenRequestHandler.cancelToken.cancel(`${propertyName} canceled`)
        cancelTokenRequestHandler.cancelToken = CancelToken.source()
        return cancelTokenRequestHandler.cancelToken
      },
    }
  })

  return cancelTokenHandler
}
