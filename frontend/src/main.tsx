import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import './styles/lunaria-tokens.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
})

// Error Boundary — affiche l'erreur au lieu d'une page blanche
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null }
  static getDerivedStateFromError(error: Error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ background: '#0D0618', color: '#f5f0eb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'monospace' }}>
          <div style={{ maxWidth: '700px', width: '100%' }}>
            <h1 style={{ color: '#C9A96E', fontSize: '1.5rem', marginBottom: '1rem' }}>⚠ Erreur LUNARIA</h1>
            <pre style={{ background: '#160D2B', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(201,169,110,0.2)', overflow: 'auto', fontSize: '0.8rem', color: '#ff6b6b', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {(this.state.error as Error).message}
              {'\n\n'}
              {(this.state.error as Error).stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', background: '#C9A96E', color: '#0D0618', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Recharger
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)
