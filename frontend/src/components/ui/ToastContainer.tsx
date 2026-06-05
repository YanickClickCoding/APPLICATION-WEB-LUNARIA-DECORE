import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore, type ToastType } from '@/stores/useToastStore'

const CONFIG: Record<ToastType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  success: { icon: CheckCircle,   color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  error:   { icon: XCircle,       color: 'text-red-400',     bg: 'bg-red-500/10',     border: 'border-red-500/30' },
  info:    { icon: Info,          color: 'text-blue-400',    bg: 'bg-blue-500/10',    border: 'border-blue-500/30' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400',  bg: 'bg-yellow-500/10',  border: 'border-yellow-500/30' },
}

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const cfg = CONFIG[toast.type]
          const Icon = cfg.icon
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`pointer-events-auto bg-[#160D2B] backdrop-blur-md border ${cfg.border} rounded-xl p-4 shadow-2xl flex items-start gap-3`}
            >
              <div className={`p-1.5 rounded-lg ${cfg.bg} shrink-0`}>
                <Icon size={16} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{toast.title}</p>
                {toast.message && <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{toast.message}</p>}
              </div>
              <button
                onClick={() => remove(toast.id)}
                className="text-white/30 hover:text-white transition-colors shrink-0"
              >
                <X size={15} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
