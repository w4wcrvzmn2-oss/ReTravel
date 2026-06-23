import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* закрыть */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
        aria-label="Закрыть"
      >
        <X className="w-5 h-5" />
      </button>

      {/* счётчик */}
      <p className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm select-none">
        {index + 1} / {images.length}
      </p>

      {/* основное изображение */}
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl select-none"
        onClick={(e) => e.stopPropagation()}
      />

      {/* стрелки */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Предыдущее"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/25 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Следующее"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* точки-индикаторы */}
      <div className="absolute bottom-6 flex items-center gap-2">
        {images.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'bg-white w-6' : 'bg-white/35 w-1.5'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
