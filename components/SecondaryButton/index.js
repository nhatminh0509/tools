import React from 'react'
import { Button } from 'antd'
import styled from 'styled-components'

const ButtonWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.8)};
  }
`

const CustomButton = styled.div`
  border-radius: 20px;
  background-color: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  z-index: -1;
  background: linear-gradient(94.81deg, #a4f240 2.97%, #fee33e 97.03%);
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
`
const ButtonContent = styled(Button)`
  cursor: pointer;
  position: absolute !important;
  background: transparent !important;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
  color: #fff;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border: none !important;
  color: white !important;
  &.ant-btn::before {
    background: transparent !important;
  }
  &:hover,
  &:focus {
    background-color: transparent !important;
    border: none !important;
  }
`

const SecondaryButton = ({ children, className = '', width = 'auto', height = 'auto', disabled = false, loading = false, onClick = () => {}, ...rest }) => {
  return (
    <ButtonWrapper onClick={onClick} style={{ width, height }} disabled={disabled} className={`${className}`}>
      <CustomButton style={{ width, height }} />
      <ButtonContent style={{ width, height }} disabled={disabled || loading} loading={loading} {...rest}>
        {children}
      </ButtonContent>
    </ButtonWrapper>
  )
}

export default SecondaryButton
