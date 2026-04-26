export const IDE_THEMES = [
  { id: 'monokai' as const, label: 'Monokai' },
  { id: 'mariana' as const, label: 'Mariana' },
  { id: 'dracula' as const, label: 'Dracula' },
  { id: 'nord' as const, label: 'Nord' },
] as const

export type IdeThemeId = (typeof IDE_THEMES)[number]['id']

export const DEFAULT_IDE_THEME: IdeThemeId = 'monokai'

export const IDE_THEME_STORAGE_KEY = 'ide-theme'

export function isIdeThemeId(s: string): s is IdeThemeId {
  return IDE_THEMES.some((t) => t.id === s)
}
