import { useEffect, useState, type RefObject } from 'react'

export function useLineCount(ref: RefObject<HTMLElement | null>, deps: unknown) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const style = getComputedStyle(el)
      let lh = parseFloat(style.lineHeight)
      if (Number.isNaN(lh)) {
        const fs = parseFloat(style.fontSize)
        lh = fs * 1.55
      }
      setCount(Math.max(1, Math.round(el.scrollHeight / lh)))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ref, deps])

  return count
}
