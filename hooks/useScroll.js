import { useEffectOnce } from './useEffectOnce'

const useScroll = ({ parentRef, scrollable = true, callback }) => {
  useEffectOnce(() => {
    const parentDiv = parentRef.current
    if (scrollable) {
      // list has fixed height
      parentDiv.addEventListener('scroll', (e) => {
        const el = e.target
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          callback()
        }
      })
    } else {
      // list has auto height
      window.addEventListener('scroll', () => {
        console.log(window.scrollY + window.innerHeight)
        if (window.scrollY + window.innerHeight >= parentDiv.clientHeight + parentDiv.offsetTop) {
          callback()
        }
      })
    }
  })

  return null
}

export default useScroll
