import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c9c9c9;
`

const NoData = () => {
  return <Container>No Data</Container>
}

export default NoData
