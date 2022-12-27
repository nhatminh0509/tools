import React from 'react'
import images from '@/common/images'
import useModal from '@/hooks/useModal'
import Lottie from 'react-lottie'
import styled from 'styled-components'
import Image from '../Image'
import PrimaryButton from '../PrimaryButton'
import json from 'static/lottie/success.json'
import { viewTransactionHash } from '@/common/function'
import Responsive from '../Responsive'
const TransactionCompleteModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TransationCompleteHeader = styled.div`
  height: 60px;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(88.96deg, rgba(164, 242, 64, 0.7) 0.84%, rgba(254, 227, 62, 0.7) 99.11%);
  border-radius: 15px 15px 0px 0px;
  font-weight: 700;
  font-size: 28px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
  @media screen and (max-width: 768px) {
    font-size: 22px;
    line-height: 30px;
  }
`

const HeaderSide = styled.div`
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const TransactionCompleteBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  @media screen and (max-width: 768px) {
    padding: 20px 10px;
  }
`

const Text = styled.p`
  margin: 0;
  font-weight: 500;
  font-size: 22px;
  line-height: 24px;
  text-align: center;
  color: #ffffff;
  @media screen and (max-width: 768px) {
    font-size: 16px;
    line-height: 22px;
  }
`

const TransactionCompleteModal = ({ hash }) => {
  const { closeModal } = useModal()
  return (
    <TransactionCompleteModalContainer>
      <TransationCompleteHeader>
        <HeaderSide />
        Transaction Complete
        <HeaderSide>
          <Image onClick={() => closeModal()} src={images.icClose} alt='close' style={{ cursor: 'pointer' }} />
        </HeaderSide>
      </TransationCompleteHeader>
      <TransactionCompleteBody>
        {/* <Image width='300px' height='200px' radius='0px' src={images.transactionComplete} alt='transaction' /> */}
        <Responsive
          mobile={
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: json,
              }}
              width={200}
              height={175}
            />
          }
          desktop={
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: json,
              }}
              width={300}
              height={200}
            />
          }
        />
        <Text>Transaction successfully</Text>
        <Text>You can view your transaction on explorer</Text>
        <PrimaryButton onClick={() => viewTransactionHash(hash)} className='MT20'>
          View on explorer
        </PrimaryButton>
      </TransactionCompleteBody>
    </TransactionCompleteModalContainer>
  )
}

export default TransactionCompleteModal
