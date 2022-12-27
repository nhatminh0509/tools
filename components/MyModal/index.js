import React from 'react'
import { ZINDEX } from '@/common/constants'
import { setModal } from '@/controller/Redux/slice/appSlice'
import useOnClickOutside from '@/hooks/useOnClickOutside'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

const ModalMaskWrapper = styled.div`
  display: ${(props) => (props.close ? 'none' : 'flex')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${ZINDEX.MODAL};
  min-width: 100vw;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
  justify-content: center;
  align-items: center;
  padding: 30px;
`

const ModalContainer = styled.div`
  width: 100%;
  height: ${(props) => props.height || 'auto'};
  max-width: ${(props) => props.width};
  max-height: ${(props) => props.height};
  position: relative;
  &.open {
    animation: appear 0.2s ease;
    @keyframes appear {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: ${(props) => props.radius};
    background: ${(props) => props.background || '#41444B'};
    opacity: ${(props) => props.opacity || 0.3};
  }
`

const ModalContent = styled.div`
  z-index: 2;
  width: 100%;
  height: 100%;
  border-radius: ${(props) => props.radius};
  background: #41444b;
`

const MyModal = () => {
  const modal = useSelector((state) => state.app.modal)
  const dispatch = useDispatch()
  const modalRef = useRef()
  useOnClickOutside(modalRef, () => {
    if (modal) {
      modal?.afterClose && modal.afterClose()
      dispatch(setModal(null))
    }
  })

  return (
    <>
      <ModalMaskWrapper close={!modal}>
        <ModalContainer
          ref={modalRef}
          width={modal?.width || 'auto'}
          height={modal?.height || 'auto'}
          radius={modal?.radius || '10px'}
          background={modal?.background}
          opacity={modal?.opacity}
          className={modal ? 'open' : ''}
        >
          <ModalContent radius={modal?.radius || '10px'}>{modal?.content}</ModalContent>
        </ModalContainer>
      </ModalMaskWrapper>
    </>
  )
}

export default MyModal
