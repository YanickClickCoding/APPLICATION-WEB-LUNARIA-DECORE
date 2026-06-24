import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore, type ToastType } from '@/stores/useToastStore'

const CONFIG: Record<ToastType, { icon: React.ElementType; accent: string; soft: string }> = {
  success: { icon: CheckCircle,   accent: '#3ec47a', soft: 'rgba(62,196,122,.12)' },
  error:   { icon: XCircle,       accent: '#ef4444', soft: 'rgba(239,68,68,.12)' },
  info:    { icon: Info,          accent: 'var(--coral)', soft: 'var(--coral-soft)' },
  warning: { icon: AlertTriangle, accent: 'var(--gold)', soft: 'var(--gold-soft)' },
}

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()

  return (
    <div
      style={{
        position: 'fixed', top: 88, right: 16, zIndex: 100,
        display: 'flex', flexDirection: 'column', gap: 12,
        maxWidth: 380, width: 'calc(100% - 32px)', pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const cfg = CONFIG[toast.type]
          const Icon = cfg.icon
          const duration = toast.duration ?? 4000
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              style={{
                pointerEvents: 'auto', position: 'relative', overflow: 'hidden',
                background: 'var(--paper)', border: '1px solid var(--line-2)',
                borderRadius: 'var(--r-md)', padding: '14px 16px',
                boxShadow: 'var(--sh-lg)', display: 'flex', alignItems: 'flex-start', gap: 12,
              }}
            >
              {/* Liseré couleur à gauche */}
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: cfg.accent }} />

              <div style={{ width: 32, height: 32, borderRadius: '50%', background: cfg.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} color={cfg.accent} />
              </div>

              <div style={{ flex: 1, minWidth: 0, paddingTop: 1 }}>
                <p style={{ color: 'var(--ink)', fontSize: 14, fontWeight: 700, margin: 0 }}>{toast.title}</p>
                {toast.message && <p style={{ color: 'var(--muted)', fontSize: 12.5, marginTop: 2, lineHeight: 1.5 }}>{toast.message}</p>}
              </div>

              <button
                onClick={() => remove(toast.id)}
                aria-label="Fermer"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-2)', flexShrink: 0, display: 'flex', padding: 2 }}
              >
                <X size={16} />
              </button>

              {/* Barre de progression */}
              {duration > 0 && (
                <motion.span
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: duration / 1000, ease: 'linear' }}
                  style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: cfg.accent, transformOrigin: 'left', opacity: .5 }}
                />
              )}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
