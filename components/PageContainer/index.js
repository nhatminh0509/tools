import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  justify-content: center;
`

const Wrapper = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 0px 20px;
`

const Box = styled.div`
  width: 100%;
  height: calc(100vh - 240px);
  padding: 25px;
  position: relative;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${(props) => (props.loading ? 'center' : 'flex-start')};
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 10, 0.2);
  @media screen and (max-height: 740px) {
    height: 500px;
  }
  &::before {
    z-index: 1;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(130.04deg, #a4f240 -0.23%, #fee33e 100.21%);
    opacity: 0.1;
    border-radius: 10px;
  }
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`

const PageContainer = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <Wrapper>
        <Box>
          <Content>{children}</Content>
        </Box>
      </Wrapper>
    </Container>
  )
}

export default PageContainer
