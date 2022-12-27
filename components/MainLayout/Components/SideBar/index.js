import images from '@/common/images'
import Image from '@/components/Image'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { SidebarContainer, SidebarButton, SidebarButtonContainer } from './styles'

const HeaderLogo = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #f4f6ff;
  margin-top: 20px;
`

const SideBar = () => {
  const sidebar = useSelector((state) => state.app.sidebar)

  return (
    <SidebarContainer showSidebar={sidebar}>
      <Image className='MT40' width={70} height={70} src={images.logo} alt='header' />
      <HeaderLogo>Holders & Transfer</HeaderLogo>
      <SidebarButtonContainer className='MT25'>
        <SidebarButton href='/'>Home</SidebarButton>
        <SidebarButton href='/transfer'>Transfer</SidebarButton>
      </SidebarButtonContainer>
    </SidebarContainer>
  )
}

export default SideBar
