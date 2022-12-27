import React from 'react'
import ImageNext from 'next/image'
import styled from 'styled-components'
import ClientRender from '../ClientRender'

const Icon = styled(ImageNext)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: ${(props) => props.radius};
  cursor: ${(props) => props.cursor};
`

const Image = ({ width = 20, height = 20, radius = '50%', cursor = 'default', src = '', ...rest }) => {
  return (
    <ClientRender>
      <Icon
        layout='raw'
        src={typeof src === 'string' ? encodeURI(src) : src}
        width={!width.toString().includes('%') ? `${width}px` : width}
        height={!height.toString().includes('%') ? `${height}px` : height}
        radius={radius}
        cursor={cursor}
        {...rest}
      />
    </ClientRender>
  )
}

export default Image
