import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { CV_FILES, getFileEntry, isCvFileId, type CvFileId } from '../../config/cvFiles'
import { IDE_THEMES, isIdeThemeId, type IdeThemeId } from '../../config/ideThemes'
import { cv } from '../../data/cvData'

type Line = { t: 'in' | 'out' | 'err'; text: string }

type Props = {
  onOpenFile: (id: CvFileId) => void
  currentTheme: IdeThemeId
  onTheme: (t: IdeThemeId) => void
}

function resolveOpenTarget(raw: string): CvFileId | null {
  const q = raw.trim().toLowerCase()
  if (!q) return null
  if (isCvFileId(q)) return q
  const noDot = q.replace(/^\.\//, '')
  const byFile = CV_FILES.find(
    (f) => f.file.toLowerCase() === noDot || f.file.toLowerCase() === q,
  )
  if (byFile) return byFile.id
  const partial = CV_FILES.find(
    (f) => f.id.startsWith(q) || f.file.toLowerCase().includes(q),
  )
  return partial?.id ?? null
}

export function TerminalPanel({ onOpenFile, currentTheme, onTheme }: Props) {
  const [expanded, setExpanded] = useState(true)
  const [lines, setLines] = useState<Line[]>([])
  const [draft, setDraft] = useState('')
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const didWelcome = useRef(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) {
        e.preventDefault()
        setExpanded(false)
        return
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.code === 'Backquote')) {
        e.preventDefault()
        setExpanded((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [expanded])

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus()
      if (!didWelcome.current) {
        didWelcome.current = true
        setLines([
          {
            t: 'out',
            text: 'cv-shell 1.0 — escribí `help` o usá `open profile.md` / id (`open proyectos`) para abrir secciones.',
          },
          {
            t: 'out',
            text: 'Atajo: Ctrl+` (o Cmd+` en Mac) para abrir o cerrar el panel. Escape cierra.',
          },
        ])
      }
    }
  }, [expanded])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' })
  }, [lines, expanded])

  const runCommand = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      if (cmd.length === 0) return
      if (cmd.toLowerCase() === 'clear') {
        setLines([])
        return
      }

      const lower = cmd.toLowerCase()
      const [head, ...rest] = lower.split(/\s+/)
      const arg = rest.join(' ').trim()
      const next: Line[] = [{ t: 'in', text: raw }]

      switch (head) {
        case 'help': {
          next.push(
            { t: 'out', text: 'Comandos:' },
            { t: 'out', text: '  help              — ayuda' },
            { t: 'out', text: '  clear             — vaciar consola' },
            { t: 'out', text: '  files | ls        — listar "archivos" del CV' },
            { t: 'out', text: '  open <id|archivo> — abrir (ej. open perfil, open github.json)' },
            { t: 'out', text: '  theme <tema>      — monokai, mariana, dracula, nord' },
            { t: 'out', text: '  whoami            — breve ficha' },
            { t: 'out', text: '  date              — hora local' },
          )
          break
        }
        case 'files':
        case 'ls': {
          const text = CV_FILES.map(
            (f) => `  ${f.id.padEnd(12, ' ')}  ${f.file}  — ${f.label}`,
          ).join('\n')
          next.push({ t: 'out', text })
          break
        }
        case 'open': {
          if (!arg) {
            next.push({ t: 'err', text: 'Uso: open <id o nombre de archivo>  (ver: files)' })
            break
          }
          const id = resolveOpenTarget(arg)
          if (!id) {
            next.push({ t: 'err', text: `No encontré "${arg}". Probá: files` })
            break
          }
          onOpenFile(id)
          const meta = getFileEntry(id)
          next.push({ t: 'out', text: `Abrí ${meta.file} (#${id}) en el editor.` })
          break
        }
        case 'theme': {
          if (!arg) {
            next.push({
              t: 'out',
              text: `Tema actual: ${currentTheme}.  Uso: theme <${IDE_THEMES.map((x) => x.id).join(' | ')}>`,
            })
            break
          }
          if (!isIdeThemeId(arg)) {
            next.push({ t: 'err', text: 'Tema no reconocido. Usá: theme monokai' })
            break
          }
          onTheme(arg)
          next.push({ t: 'out', text: `Tema aplicado: ${arg}.` })
          break
        }
        case 'whoami': {
          next.push({ t: 'out', text: `${cv.name} — ${cv.headline}` })
          break
        }
        case 'date': {
          next.push({ t: 'out', text: new Date().toLocaleString('es-PE', { dateStyle: 'full', timeStyle: 'short' }) })
          break
        }
        default: {
          next.push({ t: 'err', text: `Comando desconocido: ${head}.  Escribí help.` })
        }
      }

      setLines((prev) => [...prev, ...next])
    },
    [currentTheme, onOpenFile, onTheme],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const t = draft
    setDraft('')
    runCommand(t)
  }

  return (
    <div
      className={`ide-terminal ${expanded ? 'ide-terminal--open' : 'ide-terminal--closed'}`}
      aria-label="Terminal simulada"
    >
      <div className="ide-terminal__header">
        <button
          type="button"
          className="ide-terminal__header-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <span className="ide-terminal__chev" aria-hidden>
            {expanded ? '▾' : '▸'}
          </span>
          <span className="ide-terminal__title">TERMINAL</span>
        </button>
        <span className="ide-terminal__hint">Ctrl+`</span>
      </div>

      {expanded && (
        <div className="ide-terminal__panel">
          <div ref={bodyRef} className="ide-terminal__body" role="log" aria-live="polite">
            {lines.map((l, i) => (
              <div
                key={`L${i}`}
                className={
                  l.t === 'in'
                    ? 'ide-terminal__line ide-terminal__line--in'
                    : l.t === 'err'
                      ? 'ide-terminal__line ide-terminal__line--err'
                      : 'ide-terminal__line'
                }
              >
                {l.t === 'in' ? <span className="ide-terminal__prefix">$ </span> : null}
                <span className="ide-terminal__line-text">{l.text}</span>
              </div>
            ))}
          </div>
          <form className="ide-terminal__form" onSubmit={onSubmit} autoComplete="off">
            <span className="ide-terminal__prompt" aria-hidden>
              ~/cv ${' '}
            </span>
            <input
              ref={inputRef}
              className="ide-terminal__input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="help"
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Comando de terminal"
            />
          </form>
        </div>
      )}
    </div>
  )
}
