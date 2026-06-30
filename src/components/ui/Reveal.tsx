import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface Props {
  children: ReactNode
  className?: string
  /** Direction the element travels from. */
  direction?: Direction
  /** Stagger delay in seconds. */
  delay?: number
  /** Travel distance in px. */
  distance?: number
  /** Animate every time it enters the viewport instead of just once. */
  repeat?: boolean
  /** Render element tag. */
  as?: 'div' | 'li' | 'section' | 'article'
}

const offset = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up': return { y: distance }
    case 'down': return { y: -distance }
    case 'left': return { x: distance }
    case 'right': return { x: -distance }
    default: return {}
  }
}

export default function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  distance = 28,
  repeat = false,
  as = 'div',
}: Props) {
  const reduce = useReducedMotion()

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, filter: 'blur(6px)', ...offset(direction, distance) },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      x: 0,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !repeat, margin: '-80px' }}
    >
      {children}
    </MotionTag>
  )
}
