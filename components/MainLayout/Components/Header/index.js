import React from 'react'
import images from '@/common/images'
import ClientRender from '@/components/ClientRender'
import PrimaryButton from '@/components/PrimaryButton'
import Image from '@/components/Image'
import Media from 'react-media'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from '@/hooks/useAuth'
import { ellipsisAddress } from '@/common/function'
import { Affix } from 'antd'
import useModal from '@/hooks/useModal'
import { CONNECTION_METHOD } from '@/common/constants'
import WalletConnectServices from '@/controller/Web3/walletconnect'
import ReduxService from '@/controller/Redux/redux'
import WalletConnectModal from '@/components/WalletConnectModal'
import { setConnectionMethod } from '@/controller/Redux/slice/appSlice'
import { isMobile } from 'react-device-detect'
import MetamaskServices from '@/controller/Web3/metamask'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import SelectInput from '@/components/SelectInput'

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #10375c;
`

const HeaderLogo = styled.div`
  font-size: 22px;
  font-weight: bold;
  color: #f4f6ff;
  margin-left: 10px;
  cursor: pointer;
`

export const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 20px;
`

export const HeaderSide = styled.div`
  display: flex;
  align-items: center;
`

export const Menu = styled.div`
  cursor: pointer;
  width: 30px;
  height: 17px;
`

export const HeaderContainerMobile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  z-index: 100;
  background: #10375c;
`

const Header = ({ displayDesktop = true, displayMobile = true }) => {
  const { connectionMethod, sidebar, chainConnected } = useSelector((state) => state.app)
  const dispatch = useDispatch()
  const router = useRouter()
  const { isSigned, userAddress } = useAuth()
  const { openModal } = useModal()
  const onConnect = () => {
    openModal({
      content: <WalletConnectModal />,
      width: '450px',
      radius: '15px',
    })
  }

  const logout = () => {
    if (connectionMethod === CONNECTION_METHOD.WALLET_CONNECT) {
      WalletConnectServices.killSession()
    } else {
      ReduxService.resetUser()
    }
  }

  const handleConnect = () => {
    if (isSigned) {
      logout()
    } else {
      if (isMobile && window.ethereum) {
        dispatch(setConnectionMethod(CONNECTION_METHOD.METAMASK))
        MetamaskServices.initialize()
      } else {
        onConnect()
      }
    }
  }

  return (
    <ClientRender>
      <Media
        queries={{
          small: '(max-width: 768px)',
          large: '(min-width: 769px)',
        }}
      >
        {(matches) => (
          <>
            {matches.small && displayMobile && (
              <Affix style={{ width: '100%' }}>
                <HeaderContainerMobile>
                  <HeaderWrapper>
                    <HeaderSide onClick={() => router.push('/')}>
                      {!sidebar && <Image cursor='pointer' width={45} height={45} src={images.logo} alt='header' />}
                    </HeaderSide>
                    <HeaderSide>
                      <SelectInput
                        className='ML20 MR20'
                        onChange={(v) => ReduxService.switchChain(Number(v))}
                        value={`${chainConnected}`}
                        options={[
                          { name: 'BSC Mainnet', value: '56' },
                          { name: 'BSC Testnet', value: '97' },
                          { name: 'AVAX Testnet', value: '43113' },
                          { name: 'ETH Testnet', value: '5' },
                        ]}
                      />
                      <PrimaryButton onClick={() => handleConnect()} height='30px' width='180px'>
                        {isSigned ? ellipsisAddress(userAddress, 4, 4) : 'Connect Wallet'}
                      </PrimaryButton>
                      {/* <Image
                      layout='raw'
                      onClick={() => dispatch(toggleSidebar())}
                      src={images.icMenu}
                      alt='menu'
                      radius='0px'
                      style={{ cursor: 'pointer' }}
                      className='ML20'
                    /> */}
                    </HeaderSide>
                  </HeaderWrapper>
                </HeaderContainerMobile>
              </Affix>
            )}
            {matches.large && displayDesktop && (
              <HeaderContainer>
                <HeaderWrapper>
                  <HeaderSide onClick={() => router.push('/')}>
                    {!sidebar && <Image className='ML40' width={45} height={45} src={images.logo} alt='header' />}
                    {!sidebar && <HeaderLogo>Holders & Transfer</HeaderLogo>}
                  </HeaderSide>
                  <HeaderSide>
                    <SelectInput
                      onChange={(v) => ReduxService.switchChain(Number(v))}
                      className='ML20 MR20'
                      value={`${chainConnected}`}
                      options={[
                        { name: 'BSC Mainnet', value: '56' },
                        { name: 'BSC Testnet', value: '97' },
                        { name: 'AVAX Testnet', value: '43113' },
                        { name: 'ETH Testnet', value: '5' },
                      ]}
                    />
                    <PrimaryButton onClick={() => handleConnect()} height='30px' width='180px'>
                      {isSigned ? ellipsisAddress(userAddress, 4, 4) : 'Connect Wallet'}
                    </PrimaryButton>
                    {/* <Image
                      layout='raw'
                      onClick={() => dispatch(toggleSidebar())}
                      src={images.icMenu}
                      alt='menu'
                      radius='0px'
                      style={{ cursor: 'pointer' }}
                      className='ML20'
                    /> */}
                  </HeaderSide>
                </HeaderWrapper>
              </HeaderContainer>
            )}
          </>
        )}
      </Media>
    </ClientRender>
  )
}
export default Header
