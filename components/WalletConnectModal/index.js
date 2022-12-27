import React from 'react'
import { CONNECTION_METHOD } from '@/common/constants'
import images from '@/common/images'
import Image from '@/components/Image'
import { setConnectionMethod } from '@/controller/Redux/slice/appSlice'
import MetamaskServices from '@/controller/Web3/metamask'
import WalletConnectServices from '@/controller/Web3/walletconnect'
import useModal from '@/hooks/useModal'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { isMobile } from 'react-device-detect'

const WalletConnectModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const WalletConnectHeader = styled.div`
  height: 60px;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #52575d;
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

const WalletConnectBody = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const WalletConnectContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: ${(props) => (props.center ? 'center' : 'space-between')};
`

const WalletConnect = styled.div`
  width: 50%;
  padding: 0px 10px;
  display: flex;
  justify-content: center;
`

const WalletConnectButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const Text = styled.div`
  font-weight: 500;
  font-size: 22px;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
  @media screen and (max-width: 768px) {
    font-size: 18px;
    line-height: 20px;
  }
`

const WalletConnectModal = () => {
  const dispatch = useDispatch()
  const { closeModal } = useModal()
  const onConnectMetamask = () => {
    dispatch(setConnectionMethod(CONNECTION_METHOD.METAMASK))
    closeModal()
    MetamaskServices.initialize()
  }

  const onConnectWalletConnect = () => {
    dispatch(setConnectionMethod(CONNECTION_METHOD.WALLET_CONNECT))
    closeModal()
    WalletConnectServices.initialize()
  }

  return (
    <WalletConnectModalContainer>
      <WalletConnectHeader>
        <HeaderSide />
        Connect your wallet
        <HeaderSide>
          <Image onClick={() => closeModal()} src={images.icClose} alt='close' style={{ cursor: 'pointer' }} />
        </HeaderSide>
      </WalletConnectHeader>
      <WalletConnectBody className='MB30'>
        <WalletConnectContainer center={isMobile} className='MT30'>
          {!isMobile && (
            <WalletConnect>
              <WalletConnectButton onClick={() => onConnectMetamask()}>
                <Image width='70px' height='70px' src={images.icMetamask} alt='metamask' />
                <Text className='MT5'>Metamask</Text>
              </WalletConnectButton>
            </WalletConnect>
          )}
          <WalletConnect>
            <WalletConnectButton onClick={() => onConnectWalletConnect()}>
              <Image width='70px' height='70px' src={images.icWallet} alt='binance' />
              <Text className='MT5'>Wallet Connect</Text>
            </WalletConnectButton>
          </WalletConnect>
        </WalletConnectContainer>
        {/* <WalletConnectContainer center className='MT30'>
          <WalletConnect>
            <WalletConnectButton onClick={() => onConnectWalletConnect()}>
              <Image width='70px' height='70px' src={images.icTrustWallet} alt='trustwallet' />
              <Text className='MT5'>Trust Wallet</Text>
            </WalletConnectButton>
          </WalletConnect>
        </WalletConnectContainer> */}
      </WalletConnectBody>
    </WalletConnectModalContainer>
  )
}

export default WalletConnectModal
