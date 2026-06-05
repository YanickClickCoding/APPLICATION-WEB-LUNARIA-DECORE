import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/useCartStore'

gsap.registerPlugin(ScrollTrigger)

interface SplitProduct {
  id: string
  name: string
  price: number
  image: string
  slug: string
  category?: string
}

interface Props {
  products: SplitProduct[]
}

export default function SplitScrollProduct({ products }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { addProduct } = useCartStore()

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.split-item')

      items.forEach((item, i) => {
        const img    = item.querySelector('.split-img')
        const info   = item.querySelector('.split-info')
        const price  = item.querySelector('.split-price')
        const tag    = item.querySelector('.split-tag')

        const isEven = i % 2 === 0

        // État initial : éléments dispersés
        gsap.set(img,   { x: isEven ? -120 : 120, opacity: 0, scale: 0.85, rotation: isEven ? -8 : 8 })
        gsap.set(info,  { y: 60, opacity: 0, scale: 0.9 })
        gsap.set(price, { y: 40, opacity: 0 })
        gsap.set(tag,   { x: isEven ? 40 : -40, opacity: 0 })

        // Timeline de rassemblement au scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1.2,
          },
        })

        tl.to(img,   { x: 0, opacity: 1, scale: 1, rotation: 0, duration: 1, ease: 'power3.out' }, 0)
          .to(tag,   { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.1)
          .to(info,  { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.2)
          .to(price, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.35)
      })
    }, containerRef)

    return () => ctx.revert()
  }, [products])

  return (
    <div ref={containerRef} className="space-y-0">
      {products.map((product, i) => {
        const isEven = i % 2 === 0
        return (
          <div
            key={product.id}
            className="split-item relative overflow-hidden py-16 md:py-24"
          >
            {/* Fond subtil */}
            <div className={`absolute inset-0 ${isEven ? 'bg-gradient-to-r from-[#160D2B]/80 to-transparent' : 'bg-gradient-to-l from-[#160D2B]/80 to-transparent'}`} />

            <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}>

              {/* Image */}
              <div className="split-img w-full md:w-1/2 relative">
                <div className="relative group">
                  {/* Badge catégorie */}
                  <span className="split-tag absolute -top-4 -left-4 z-10 bg-[#C9A96E] text-[#0D0618] text-xs font-bold px-3 py-1.5 rounded-full tracking-wider uppercase">
                    {product.category ?? 'Décoration'}
                  </span>

                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Reflet lumineux */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                </div>
              </div>

              {/* Contenu */}
              <div className={`split-info w-full md:w-1/2 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                <div className="space-y-5">
                  <h3 className="font-heading text-3xl md:text-4xl text-white font-light leading-tight">
                    {product.name}
                  </h3>

                  <div className="split-price flex items-center gap-4 flex-wrap">
                    <span className="font-heading text-3xl text-[#C9A96E]">
                      {product.price.toLocaleString('fr-FR')} <span className="text-lg">FCFA</span>
                    </span>
                  </div>

                  <div className={`flex flex-wrap gap-3 ${isEven ? '' : 'md:justify-end'}`}>
                    <button
                      onClick={() => addProduct({ _id: product.id, name: product.name, price: product.price, images: [product.image], slug: product.slug } as never)}
                      className="px-6 py-3 bg-[#C9A96E] text-[#0D0618] font-semibold rounded-xl hover:bg-[#A8813F] transition-all hover:scale-105 text-sm"
                    >
                      Ajouter au panier
                    </button>
                    <Link
                      to={`/produit/${product.slug}`}
                      className="px-6 py-3 border border-[#C9A96E]/40 text-[#C9A96E] rounded-xl hover:bg-[#C9A96E]/10 transition-all text-sm"
                    >
                      Voir le produit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
