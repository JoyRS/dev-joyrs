import { useEffect } from 'react'
import type { CvFileId } from '../config/cvFiles'
import { isCvFileId } from '../config/cvFiles'

export function useHashRouting(
  activeTab: CvFileId,
  setActiveTab: (id: CvFileId) => void,
  ensureOpen: (id: CvFileId) => void,
) {
  useEffect(() => {
    const syncFromHash = () => {
      const h = window.location.hash.slice(1)
      if (isCvFileId(h)) {
        ensureOpen(h)
        setActiveTab(h)
      }
    }
    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => window.removeEventListener('hashchange', syncFromHash)
  }, [ensureOpen, setActiveTab])

  useEffect(() => {
    const next = `#${activeTab}`
    if (window.location.hash !== next) {
      window.history.replaceState(null, '', next)
    }
  }, [activeTab])
}
