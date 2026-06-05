import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  bgImage: string
  children: ReactNode
  height?: string
  overlay?: string
}

export default function ParallaxHero({
  bgImage,
  children,
  height = 'min-h-screen',
  overlay = 'bg-gradient-to-b from-[#0D0618]/70 via-[#0D0618]/40 to-[#0D0618]',
}: Props) {
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bgRef.current
    if (!el) return

    const anim = gsap.to(el, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => { anim.kill() }
  }, [])

  return (
    <div className={`relative ${height} overflow-hidden flex items-center justify-center`}>
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  )
}
