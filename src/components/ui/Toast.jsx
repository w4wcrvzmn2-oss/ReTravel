import { Check, AlertCircle, Info, X } from 'lucide-react'
import useToastStore from '../../store/useToastStore'

const ICON = {
  success: <Check className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
}

const BG = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export default function Toast() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div className="fixed top-20 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-2xl border border-white/10 max-w-sm animate-slide-up"
        >
          <div
            className={`w-7 h-7 rounded-full ${BG[t.type]} flex items-center justify-center shrink-0`}
          >
            {ICON[t.type]}
          </div>
          <span className="text-sm flex-1 leading-snug">{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            className="text-white/50 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
