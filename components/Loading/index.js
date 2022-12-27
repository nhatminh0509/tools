import React from 'react'
import Lottie from 'react-lottie'
import json from 'static/lottie/loading.json'

const Loading = ({ width = 50, height = 50 }) => {
  return (
    <div>
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: json,
        }}
        width={width}
        height={height}
      />
    </div>
  )
}

export default Loading
