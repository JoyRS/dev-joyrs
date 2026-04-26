import { useEffect, useRef } from 'react'
import type { IdeThemeId } from '../../config/ideThemes'

const WAVE_LAYERS = [
  { colorVar: '--ide-type' as const, baseY: 0.12, period: 420, amp: 28, width: 1.1, speed: 0.09, phase: 0, alpha: 0.38 },
  { colorVar: '--ide-tab-accent' as const, baseY: 0.32, period: 510, amp: 34, width: 1, speed: 0.065, phase: 1.4, alpha: 0.32 },
  { colorVar: '--ide-func' as const, baseY: 0.48, period: 380, amp: 24, width: 0.85, speed: 0.11, phase: 2.1, alpha: 0.28 },
  { colorVar: '--ide-number' as const, baseY: 0.66, period: 560, amp: 32, width: 0.95, speed: 0.05, phase: 0.7, alpha: 0.26 },
  { colorVar: '--ide-keyword' as const, baseY: 0.82, period: 440, amp: 30, width: 0.8, speed: 0.08, phase: 2.6, alpha: 0.22 },
] as const

function rgbaFromVar(cssVal: string, a: number): string {
  const t = cssVal.trim()
  const m = t.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
  if (m) {
    const hex = m[1]!
    if (hex.length === 3) {
      const r = parseInt(hex[0]! + hex[0]!, 16)
      const g = parseInt(hex[1]! + hex[1]!, 16)
      const b = parseInt(hex[2]! + hex[2]!, 16)
      return `rgba(${r},${g},${b},${a})`
    }
    const r = parseInt(hex.slice(0, 2)!, 16)
    const g = parseInt(hex.slice(2, 4)!, 16)
    const b = parseInt(hex.slice(4, 6)!, 16)
    return `rgba(${r},${g},${b},${a})`
  }
  const rgb = t.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgb) {
    return `rgba(${rgb[1]},${rgb[2]},${rgb[3]},${a})`
  }
  return t
}

type Props = {
  theme: IdeThemeId
}

export function PspWavesBackground({ theme }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  const rafId = useRef(0)
  const t0 = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const root = () => getComputedStyle(document.documentElement)
    const step = 4
    t0.current = performance.now() / 1000

    const draw = (time: number, reduced: boolean) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      if (w < 1 || h < 1) return
      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr)
        canvas.height = Math.floor(h * dpr)
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.scale(dpr, dpr)
      }
      const rs = root()
      ctx.clearRect(0, 0, w, h)
      const now = time / 1000
      const t = reduced ? 0 : now - t0.current

      for (const L of WAVE_LAYERS) {
        const raw = rs.getPropertyValue(L.colorVar)
        if (!raw) continue
        const y0 = h * L.baseY
        ctx.beginPath()
        let first = true
        for (let x = 0; x <= w + step; x += step) {
          const wobble =
            L.amp * L.width * Math.sin((2 * Math.PI * x) / L.period - t * L.speed * 6.28 + L.phase) +
            L.amp * 0.35 * Math.sin((2 * Math.PI * x) / (L.period * 0.5) - t * L.speed * 3.1 + L.phase * 0.3)
          const y = y0 + wobble
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.strokeStyle = rgbaFromVar(raw, L.alpha)
        ctx.lineWidth = 1.4
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'
        ctx.stroke()
      }
    }

    const loop = (time: number) => {
      draw(time, mq.matches)
      if (!mq.matches) {
        rafId.current = requestAnimationFrame(loop)
      }
    }

    const run = () => {
      cancelAnimationFrame(rafId.current)
      if (mq.matches) {
        draw(performance.now(), true)
      } else {
        t0.current = performance.now() / 1000
        rafId.current = requestAnimationFrame(loop)
      }
    }

    run()
    mq.addEventListener('change', run)

    const ro = new ResizeObserver(() => {
      draw(performance.now(), mq.matches)
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(rafId.current)
      mq.removeEventListener('change', run)
      ro.disconnect()
    }
  }, [theme])

  return <canvas ref={ref} className="ide-psp-waves__canvas" aria-hidden />
}
