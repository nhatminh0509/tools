import React from 'react'
import classNames from 'classnames'
import { Button } from 'antd'
import styled from 'styled-components'

const CustomButton = styled(Button)`
  color: rgb(255, 255, 255);
  height: unset;
  cursor: pointer;
  text-align: center;
  position: relative;
  padding: 10px 20px;
  font-weight: 400;
  letter-spacing: 2px;
  border-radius: 10px;
  font-size: 1rem;
  display: inline-block;
  background-color: #f3c623;
  border: none;
  &.small {
    padding: 5px 10px;
  }
  &.medium {
    padding: 10px 20px;
  }
  &.large {
    padding: 15px 25px;
  }
  &.full-width {
    width: 100%;
  }
  &.disabled {
    opacity: 0.4;
    color: white;
    background-color: #f3c623;
    &:hover {
      opacity: 0.4;
      color: white;
      background-color: #f3c623;
    }
  }
  &:focus {
    background-color: #f3c623;
  }
  &:hover {
    opacity: 0.8;
    background-color: #f3c623;
    color: rgb(255, 255, 255);
  }
`

const PrimaryButton = (props) => {
  const { children, className = '', fullWidth = false, size = 'small', disabled, ...rest } = props
  return (
    <CustomButton disabled={disabled} className={classNames(`pri-btn ${className} ${size}`, { 'full-width': fullWidth, disabled: disabled })} {...rest}>
      {children}
    </CustomButton>
  )
}

export default PrimaryButton
