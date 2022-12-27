import React from 'react'
import { setModal } from '@/controller/Redux/slice/appSlice'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

const useModal = () => {
  const dispatch = useDispatch()

  const openModal = useCallback(
    ({
      content = () => <></>,
      width = 'auto',
      height = 'auto',
      radius = '10px',
      background = 'linear-gradient(117.72deg, #A4F240 -0.54%, #FEE33E 100.51%)',
      opacity = 0.3,
    }) => {
      dispatch(
        setModal({
          content,
          width,
          height,
          radius,
          background,
          opacity,
        })
      )
    },
    [dispatch]
  )

  const closeModal = useCallback(
    (callback = () => {}) => {
      callback && callback()
      dispatch(setModal(null))
    },
    [dispatch]
  )

  return {
    closeModal,
    openModal,
  }
}

export default useModal
