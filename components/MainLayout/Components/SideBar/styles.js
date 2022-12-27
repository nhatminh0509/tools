import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { lowerCase } from '@/common/function'

export const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props) => (props.showSidebar ? '250px' : '0px')};
  overflow: hidden;
  min-height: 100vh;
  max-width: 250px;
  background: #10375c;
  z-index: 9;
  transition: 0.5s;
  @media screen and (max-width: 768px) {
    width: ${(props) => (props.showSidebar ? '100vw' : '0px')};
    max-width: 100vw;
  }
`

export const SidebarButtonContainer = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
`

export const SidebarButtonContent = styled.a`
  cursor: pointer;
  height: 25px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  text-align: center;
  padding: 0px 25px;
  background: rgba(217, 217, 217, 0.16);
  border-radius: 20px;
  font-weight: 400;
  font-size: 15px;
  color: #ffffff;
  &:hover {
    color: #ffffff;
    opacity: 0.7;
  }
  &.active {
    background: #ffffff;
    color: #393929;
  }
  @media screen and (max-width: 768px) {
    padding: 0px 15px;
  }
`

export const SidebarButton = ({ href = '', routeActive = [], children, className = '', ...rest }) => {
  const route = useRouter()
  const routes = [...routeActive.map((item) => lowerCase(item)), href.toLowerCase()]
  return (
    <Link href={href}>
      <SidebarButtonContent className={`${className} ${routes.includes(lowerCase(route.asPath)) ? 'active' : ''}`} href={href} {...rest}>
        {children}
      </SidebarButtonContent>
    </Link>
  )
}
