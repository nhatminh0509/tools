import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Header from './Components/Header'
// import SideBar from './Components/SideBar'

const MainLayoutContainer = styled.div`
  min-height: 100vh;
  min-width: 100vw;
  display: flex;
  align-items: center;
  background-color: #f4f6ff;
`

// const SideBarMargin = styled.div`
//   width: 250px;
//   @media screen and (max-width: 1400px) {
//     display: none;
//   }
// `

const RightSide = styled.div`
  min-height: 100vh;
  flex: 1;
  max-width: ${(props) => (props.showSidebar ? 'calc(100vw - 250px)' : '100vw')};
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1400px) {
    max-width: 100vw;
  }
`

const Body = styled.div`
  width: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
`

const MainLayout = ({ children }) => {
  const sidebar = useSelector((state) => state.app.sidebar)
  return (
    <MainLayoutContainer>
      {/* <SideBar /> */}
      {/* {sidebar && <SideBarMargin />} */}
      <RightSide showSidebar={sidebar}>
        <Header />
        <Body>{children}</Body>
      </RightSide>
    </MainLayoutContainer>
  )
}

export default MainLayout
