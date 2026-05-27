import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Carousel({ items, renderItem, renderHeader, autoPlay = true, autoPlayInterval = 3500 }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % items.length)
    }, autoPlayInterval)
    return () => clearInterval(timer)
  }, [items.length, autoPlay, autoPlayInterval])

  function prev() {
    setCurrent(i => (i - 1 + items.length) % items.length)
  }

  function next() {
    setCurrent(i => (i + 1) % items.length)
  }

  return (
    <div className="flex flex-col gap-3">

      {renderHeader
        ? renderHeader({ prev, next, current, total: items.length })
        : null
      }

      <div className="relative overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, i) => (
            <div key={i} className="w-full flex-none">
              {renderItem(item)}
            </div>
          ))}
        </div>

        {!renderHeader && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-surface-high/80 p-1.5 text-muted backdrop-blur-sm transition-colors hover:text-text"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-surface-high/80 p-1.5 text-muted backdrop-blur-sm transition-colors hover:text-text"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300',
              i === current ? 'w-4 bg-primary' : 'w-1.5 bg-border'
            )}
          />
        ))}
      </div>

    </div>
  )
}
