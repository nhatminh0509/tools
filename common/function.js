/* eslint-disable no-undef */
import ReduxService from '@/controller/Redux/redux'
import { notification } from 'antd'
import bigdecimal from 'bigdecimal'
import { toast } from 'react-toastify'
import shortid from 'shortid'

export const showNotification = (title = null, description = '', type = 'open') => {
  let params = {
    placement: 'bottomRight',
    className: 'notification-class',
    bottom: 54,
    duration: 5,
  }
  if (title) {
    params['message'] = title
  }
  if (description) {
    params['description'] = description
  }
  notification[type](params)
}

export const destroyNotification = () => {
  notification.destroy()
}

export const saveDataLocal = (key, data) => {
  // eslint-disable-next-line no-undef
  localStorage.setItem(key, JSON.stringify(data))
}

export const getDataLocal = (key) => {
  // eslint-disable-next-line no-undef
  return JSON.parse(localStorage.getItem(key))
}

export const removeDataLocal = (key) => {
  // eslint-disable-next-line no-undef
  localStorage.removeItem(key)
}

export const lowerCase = (value) => {
  return value ? value.toLowerCase() : value
}

export const upperCase = (value) => {
  return value ? value.toUpperCase() : value
}

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * max) + min
}

export const convertBalanceToWei = (strValue, iDecimal = 18) => {
  var multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal))
  var convertValue = new bigdecimal.BigDecimal(String(strValue))
  return multiplyNum.multiply(convertValue).toString().split('.')[0]
}

export const convertWeiToBalance = (strValue, iDecimal = 18) => {
  var multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal))
  var convertValue = new bigdecimal.BigDecimal(String(strValue))
  return scientificToDecimal(convertValue.divide(multiplyNum).toString())
}

export const numberWithCommas = (x) => {
  var parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const roundingNumber = (number, rounding = 7) => {
  const powNumber = Math.pow(10, parseInt(rounding))
  return Math.floor(number * powNumber) / powNumber
}

export const numberWithAbbreviator = (number, decPlaces) => {
  decPlaces = Math.pow(10, decPlaces)

  let abbrev = ['K', 'M', 'B', 'T']
  for (let i = abbrev.length - 1; i >= 0; i--) {
    var size = Math.pow(10, (i + 1) * 3)
    if (size <= number) {
      number = Math.round((number * decPlaces) / size) / decPlaces
      number = numberWithCommas(number) + abbrev[i]
      break
    }
  }

  return number
}

export const renderAmountToken = (number, decimal = 4) => {
  return numberWithAbbreviator(roundingNumber(number, decimal), decimal)
}

export const scientificToDecimal = (num) => {
  const sign = Math.sign(num)
  if (/\d+\.?\d*e[+-]*\d+/i.test(num)) {
    const zero = '0'
    const parts = String(num).toLowerCase().split('e')
    const e = parts.pop()
    let l = Math.abs(e)
    const direction = e / l
    const coeffArray = parts[0].split('.')

    if (direction === -1) {
      coeffArray[0] = Math.abs(coeffArray[0])
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('')
    } else {
      const dec = coeffArray[1]
      if (dec) l = l - dec.length
      num = coeffArray.join('') + new Array(l + 1).join(zero)
    }
  }

  if (sign < 0) {
    num = -num
  }

  return num
}

export const ellipsisAddress = (address, prefixLength = 13, suffixLength = 4) => {
  return `${address.substr(0, prefixLength)}...${address.substr(address.length - suffixLength, suffixLength)}`
}

export const viewTransactionHash = (hash) => {
  if (ReduxService.getChainConnected() === 97) {
    window.open('https://testnet.bscscan.com/tx/' + hash, '_blank')
  } else {
    window.open('https://bscscan.com/tx/' + hash, '_blank')
  }
}

export const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object
}

export const isNotEnoughGas = (err = null) => {
  err = isObject(err) ? err : { message: err.toString() }
  const outOfGasMsg = 'gas required exceeds allowance'
  return (err.message && err.message.includes(outOfGasMsg)) || (err.stack && err.stack.includes(outOfGasMsg))
}

export const detectErrorMessage = (err = null) => {
  if (err && err?.reason && typeof err?.reason === 'string') {
    return err.reason.split('execution reverted: ').join('')
  } else {
    return `Something went wrong !!`
  }
}

export const isUserDeniedTransaction = (err = null) => {
  err = isObject(err) ? err : { message: err ? err.toString() : '' }
  const deninedMsg = 'User denied transaction signature'
  const rejectReq = 'Failed or Rejected Request'
  return (err.message && err.message.includes(deninedMsg)) || (err.message && err.message.includes(rejectReq)) || (err.stack && err.stack.includes(deninedMsg))
}

export const showNotificationError = (errorMessage = '') => {
  toast.error(errorMessage, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export const showNotificationSuccess = (message = '') => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export const callBackErrorTransaction = (error) => {
  if (isNotEnoughGas(error)) {
    showNotificationError(`You don't have enough gas`)
  } else if (isUserDeniedTransaction(error)) {
    showNotificationError(`Error: User denied process`)
  } else {
    showNotificationError(detectErrorMessage(error))
  }
}

export const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const romanize = (num) => {
  if (isNaN(num)) return NaN
  let digits = String(+num).split(''),
    key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
    ],
    roman = '',
    i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}

export const generateShortId = () => {
  return shortid.generate()
}

export const convertSecondToDay = (seconds) => {
  return Math.floor(seconds / (3600 * 24))
}

export const convertDayToSecond = (day) => {
  return Math.floor(day * (3600 * 24))
}

export const pad = (d) => {
  return d < 10 ? '0' + d.toString() : d.toString()
}

export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const countDots = (strString, strLetter) => {
  let string = strString.toString()
  return (string.match(RegExp(strLetter, 'g')) || []).length
}

export const validateAddress = (strAddress) => {
  var reg = ''
  if (!strAddress.startsWith('0x')) {
    return false
  }

  if (countDots(strAddress, '\\x') > 1) {
    reg = /^([A-Fa-f0-9_]+)$/
  } else {
    reg = /^([A-Fa-f0-9_x]+)$/
  }

  return reg.test(strAddress)
}
