import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_IDE_THEME,
  IDE_THEME_STORAGE_KEY,
  isIdeThemeId,
  type IdeThemeId,
} from '../config/ideThemes'

function readStoredTheme(): IdeThemeId {
  if (typeof localStorage === 'undefined') return DEFAULT_IDE_THEME
  try {
    const v = localStorage.getItem(IDE_THEME_STORAGE_KEY)
    if (v && isIdeThemeId(v)) return v
  } catch {
    /* ignore */
  }
  return DEFAULT_IDE_THEME
}

export function useIdeTheme() {
  const [theme, setTheme] = useState<IdeThemeId>(readStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-ide-theme', theme)
    try {
      localStorage.setItem(IDE_THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setIdeTheme = useCallback((t: IdeThemeId) => {
    setTheme(t)
  }, [])

  return { theme, setTheme: setIdeTheme }
}
