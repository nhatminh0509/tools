import { callBackErrorTransaction, convertBalanceToWei, showNotificationSuccess } from '@/common/function'
import PrimaryButton from '@/components/PrimaryButton'
import Web3Services from '@/controller/Web3'
import useAuth from '@/hooks/useAuth'
import { Input } from 'antd'
import { ethers } from 'ethers'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import FourOhFour from './404'

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const InputContainer = styled.div`
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  @media screen and (max-width: 768px) {
    width: 90vw;
  }
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const AmountContainer = styled.div`
  width: 150px;
`

const Label = styled.div`
  font-size: 16px;
`

const CustomInput = styled(Input)`
  width: 100%;
`

const STEP = {
  INPUT_ADDREES_TOKEN: 'input_address_token',
  CHOOSE_MODE: 'choose_mode',
  ALL_INPUT_ADDRESSES: 'all_input_addresses',
  PER_ADDRESS_INPUT_ADDRESS: 'per_address_input_addrees',
}

const Home = () => {
  const contractTransfer = '0xf867a0ed8d6dfa43346fdc5d1cf562274614fdc6'
  const { isSigned, userAddress } = useAuth()

  const [step, setStep] = useState(STEP.INPUT_ADDREES_TOKEN)

  const [textTokenAdddress, setTextTokenAddress] = useState('')

  const [amount, setAmount] = useState(0)
  const [addresses, setAddresses] = useState([''])

  const [addressesWithAmount, setAddressesWithAmount] = useState({})

  const [tokenName, setTokenName] = useState(null)
  const [loading, setLoading] = useState(false)

  const listAddress = useMemo(() => Object.keys(addressesWithAmount), [addressesWithAmount])

  const listAmount = useMemo(() => Object.values(addressesWithAmount).filter((item) => Number(item) > 0), [addressesWithAmount])

  const reset = () => {
    setStep(STEP.INPUT_ADDREES_TOKEN)
    setTextTokenAddress('')
    setAmount(0)
    setAddresses([''])
    setAddressesWithAmount({})
    setTokenName(null)
  }

  useEffect(() => {
    const get = async () => {
      setLoading(true)
      const res = await Web3Services.getTokenName(textTokenAdddress)
      setTokenName(res)
      setLoading(false)
    }
    if (ethers.utils.isAddress(textTokenAdddress)) {
      get()
    } else {
      setTokenName('')
    }
  }, [textTokenAdddress])

  useEffect(() => {
    if (step === STEP.ALL_INPUT_ADDRESSES) {
      let newValue = {}
      addresses.filter((item) => ethers.utils.isAddress(item)).map((item) => (newValue[item?.toLowerCase()] = amount))
      setAddressesWithAmount(newValue)
    } else {
      let newValue = {}
      addresses.filter((item) => ethers.utils.isAddress(item)).map((item) => (newValue[item.toLowerCase()] = addressesWithAmount[item.toLowerCase()] || '0'))
      setAddressesWithAmount(newValue)
    }
  }, [amount, addresses, step])

  const onChangeAddresses = (value = '') => {
    const newValue = value.split(`\n`) || []
    setAddresses([...newValue.map((item) => item.toLowerCase().split(' ').join('')).filter((item) => item !== ''), ''])
  }

  const onChangeAddress = (value = '', index) => {
    const newValue = [...addresses]
    newValue[index] = value.split(' ').join('')
    setAddresses([...newValue.filter((item) => item !== ''), ''])
  }

  const onChangeAmount = (value = '', address = '') => {
    const newValue = { ...addressesWithAmount }
    newValue[address.toLowerCase()] = value
    setAddressesWithAmount(newValue)
  }

  const onSubmit = async () => {
    setLoading(true)
    const decimals = await Web3Services.getTokenDecimals(textTokenAdddress)
    const totalAmount = listAmount.reduce((sum, amount) => Number(sum) + Number(amount))
    const needApprove = await Web3Services.needApprove(userAddress, contractTransfer, textTokenAdddress, totalAmount)
    const callbackBeforeDone = () => {}
    const callbackRejected = (error) => {
      callBackErrorTransaction(error)
      setLoading(false)
    }

    const onTransfer = () => {
      const callbackAfterDone = async () => {
        reset()
        showNotificationSuccess(`Transfer successfully`)
        setLoading(false)
      }

      Web3Services.multiTransferToken(
        userAddress,
        contractTransfer,
        textTokenAdddress,
        listAddress,
        listAmount.map((item) => convertBalanceToWei(`${item}`, decimals)),
        callbackRejected,
        callbackBeforeDone,
        callbackAfterDone
      )
    }
    if (needApprove) {
      const callbackAfterDoneApprove = async () => {
        onTransfer()
      }
      Web3Services.approveTokenAmount(
        userAddress,
        textTokenAdddress,
        contractTransfer,
        totalAmount,
        decimals,
        false,
        callbackRejected,
        callbackBeforeDone,
        callbackAfterDoneApprove
      )
    } else {
      onTransfer()
    }
  }

  if (!isSigned) {
    return <FourOhFour />
  }
  return (
    <HomeContainer>
      {step === STEP.INPUT_ADDREES_TOKEN && (
        <>
          <InputContainer>
            <Label>Contract token address: </Label>
            <CustomInput value={textTokenAdddress} onChange={(e) => setTextTokenAddress(e.target.value)} />
          </InputContainer>

          <PrimaryButton loading={loading} disabled={!tokenName} onClick={() => setStep(STEP.CHOOSE_MODE)} className='MT20'>
            Next step {tokenName && `(${tokenName})`}
          </PrimaryButton>
        </>
      )}

      {step === STEP.CHOOSE_MODE && (
        <>
          <InputContainer>
            <Label>Choose mode:</Label>
            <PrimaryButton onClick={() => setStep(STEP.ALL_INPUT_ADDRESSES)} className='MT20'>
              Amount for all
            </PrimaryButton>
            <PrimaryButton onClick={() => setStep(STEP.PER_ADDRESS_INPUT_ADDRESS)} className='MT20'>
              Amount per address
            </PrimaryButton>
          </InputContainer>
        </>
      )}

      {step === STEP.ALL_INPUT_ADDRESSES && (
        <>
          <InputContainer>
            <Label>Amount: </Label>
            <CustomInput value={amount} type='number' onChange={(e) => setAmount(e.target.value)} />
          </InputContainer>
          <InputContainer className='MT20'>
            <Label>Addresses: </Label>
            <CustomInput.TextArea value={addresses.join(`\n`)} rows={5} onChange={(e) => onChangeAddresses(e.target.value)} />
          </InputContainer>
          <PrimaryButton
            loading={loading}
            onClick={() => onSubmit()}
            disabled={listAddress.length === 0 || listAddress.length !== listAmount.length}
            className='MT20'
          >
            Transfer
          </PrimaryButton>
        </>
      )}

      {step === STEP.PER_ADDRESS_INPUT_ADDRESS && (
        <>
          <InputContainer className='MT20'>
            <Label>Addresses: </Label>
            {addresses.map((address, index) => (
              <InputWrapper key={index}>
                <CustomInput value={address} onChange={(e) => onChangeAddress(e.target.value, index)} />
                <AmountContainer>
                  <CustomInput
                    type='number'
                    value={addressesWithAmount[address?.toLowerCase()] || ''}
                    onChange={(e) => onChangeAmount(e.target.value, address)}
                    disabled={!ethers.utils.isAddress(address)}
                  />
                </AmountContainer>
              </InputWrapper>
            ))}
          </InputContainer>
          <PrimaryButton
            loading={loading}
            onClick={() => onSubmit()}
            disabled={listAddress.length === 0 || listAddress.length !== listAmount.length}
            className='MT20'
          >
            Transfer
          </PrimaryButton>
        </>
      )}
    </HomeContainer>
  )
}

export default Home
