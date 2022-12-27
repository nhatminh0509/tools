import images from '@/common/images'
import { Select } from 'antd'
import React, { useState } from 'react'
import styled from 'styled-components'
import Image from '../Image'
import './style.scss'

const Container = styled.div`
  width: 100%;
  max-width: ${(props) => props.width || '100%'};
  display: flex;
  flex-direction: column;
`

const CustomSelect = styled(Select)`
  width: 100%;
  max-width: ${(props) => props.width || '100%'};
  .ant-select-selector {
    height: ${(props) => props.height} !important;
    background: transparent !important;
    display: flex;
    align-items: center;
    padding: 10px 20px !important;
    border: 1px solid #f3c623 !important;
    .ant-select-selection-search-input {
      font-weight: 400;
      font-size: 15px;
      line-height: 150%;
      text-align: center;
      color: white;
    }
  }
  .ant-select-selection-item {
    font-weight: 300;
    font-size: 15px;
    line-height: 150%;
    text-align: center;
    color: white;
  }
`

const SelectInput = ({ options = [], value = '', onChange, className = '', height = '30px', width = '100%', ...rest }) => {
  const [data, setData] = useState(value)

  const handleChangeData = (value) => {
    setData(value)
    onChange && onChange(value)
  }

  return (
    <Container width={width} className={className} {...rest}>
      <CustomSelect
        width={width}
        height={height}
        value={data}
        onChange={handleChangeData}
        dropdownClassName={`custom-select-dropdown-container`}
        suffixIcon={<Image width={15} src={images.icSelect} />}
      >
        {options.map((item) => (
          <Select.Option key={item.value}>{item.name}</Select.Option>
        ))}
      </CustomSelect>
    </Container>
  )
}

export default SelectInput
