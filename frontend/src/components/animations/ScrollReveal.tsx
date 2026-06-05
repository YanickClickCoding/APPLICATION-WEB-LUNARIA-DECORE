import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  className = '',
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const from: gsap.TweenVars = { opacity: 0 }
    if (direction === 'up')    { from.y = 50 }
    if (direction === 'down')  { from.y = -50 }
    if (direction === 'left')  { from.x = 60 }
    if (direction === 'right') { from.x = -60 }
    if (direction === 'scale') { from.scale = 0.85 }

    const anim = gsap.from(el, {
      ...from,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    })

    return () => { anim.kill(); ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [direction, delay, duration, once])

  return <div ref={ref} className={className}>{children}</div>
}
