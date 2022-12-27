import React from 'react'
import { useState, useEffect } from 'react'

const ClientRender = ({ children }) => {
  const [render, setRender] = useState(false)

  useEffect(() => {
    setRender(true)
  }, [])

  return <>{render && children}</>
}

export default ClientRender
