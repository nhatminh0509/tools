import React from 'react'
import Media from 'react-media'

const Responsive = ({ mobile = () => <></>, desktop = () => <></> }) => {
  return (
    <Media
      queries={{
        small: '(max-width: 768px)',
        large: '(min-width: 769px)',
      }}
    >
      {(matches) => (
        <>
          {matches.small && mobile}
          {matches.large && desktop}
        </>
      )}
    </Media>
  )
}

export default Responsive
