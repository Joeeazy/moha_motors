import { useRef } from 'react'
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

/**
 * Pointer-driven 3D tilt. Spread the returned `handlers` + `style` onto a
 * `motion` element, and put `perspective` on its parent (or use the returned
 * `perspectiveStyle`). Respects prefers-reduced-motion.
 */
export function useTilt(max = 8) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const springCfg = { stiffness: 150, damping: 18, mass: 0.4 }
  const sx = useSpring(px, springCfg)
  const sy = useSpring(py, springCfg)

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    px.set(0)
    py.set(0)
  }

  return {
    ref,
    handlers: { onMouseMove, onMouseLeave },
    style: reduce
      ? {}
      : { rotateX, rotateY, transformStyle: 'preserve-3d' as const },
  }
}
