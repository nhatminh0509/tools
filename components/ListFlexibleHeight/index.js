/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import useInfiniteScroll from '../../hooks/useInfiniteScroll'
import Loading from '../Loading'
import NoData from '../NoData'

const ListLayoutContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, ${(props) => props.cardWidth});
  grid-auto-rows: 1px;
  justify-content: center;
`

const ItemContainer = styled.div`
  padding: 0;
  margin: ${(props) => (props.itemWidth === '100%' ? `${(props) => props.margin} 0px` : props.margin + 'px')};
  grid-row-end: span ${(props) => props.span};
  display: flex;
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.isLoad &&
    css`
      overflow: hidden;
      opacity: 0;
    `}
`

const Item = ({ render = (item) => <></>, itemWidth, data, gap = 20 }) => {
  const ref = useRef()
  const [height, setHeight] = useState(null)

  useEffect(() => {
    const getHeight = () => {
      if (ref && ref?.current && ref?.current?.clientHeight) {
        setTimeout(() => setHeight(ref?.current?.clientHeight), 500)
        setTimeout(() => setHeight(ref?.current?.clientHeight), 1000)
      }
    }
    getHeight()
    window.addEventListener('resize', getHeight)
    return () => {
      window.removeEventListener('resize', getHeight)
    }
  }, [ref, ref.current])

  return (
    <ItemContainer margin={gap / 2} itemWidth={itemWidth} isLoad={!height} span={height ? height + gap : 0}>
      <div style={{ width: '100%' }} ref={ref}>
        {render(data)}
      </div>
    </ItemContainer>
  )
}

export const ListWrapperMobile = styled.div`
  width: 100%;
  padding: 0 5px;
  margin: 0 auto;
`

const ListFlexibleHeight = ({ itemWidth = '180px', loading = false, data = [], render = (item) => <></>, fetchMoreData = () => {}, gap = 20 }) => {
  const { loadMoreRef } = useInfiniteScroll(fetchMoreData)
  return (
    <>
      <ListLayoutContainer cardWidth={itemWidth}>
        {data.length > 0 && data.map((item, index) => <Item itemWidth={itemWidth} gap={gap} data={item} render={render} key={index} />)}
      </ListLayoutContainer>
      {loading && <Loading />}
      {!loading && data.length === 0 && <NoData />}
      <div ref={loadMoreRef} />
    </>
  )
}

export default ListFlexibleHeight
