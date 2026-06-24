import type { KeyboardEvent } from 'react'

/**
 * Rend un conteneur non-bouton accessible au clavier (Entrée / Espace).
 * À utiliser quand l'élément cliquable contient déjà des <button> enfants
 * (un vrai <button> ne peut pas en imbriquer d'autres).
 *
 * Usage :
 *   <div {...clickable(() => navigate(to), label)} className="…">
 *
 * Pour un élément cliquable SANS bouton interne, préférer un vrai <button>.
 */
export function clickable(onActivate: () => void, label?: string) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onActivate()
      }
    },
  }
}
