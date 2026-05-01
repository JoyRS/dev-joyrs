/**
 * Nombres alineados con lo que muestra cada vista (explorador estilo IDE):
 * - README / perfil / estudios / habilidades / contacto → prosa o listas (Markdown)
 * - timeline, github → JSON (datos estructurados o feed remoto)
 * - package → manifiesto npm real
 */
/* El explorador refleja cómo quieres que te lean — no solo árbol de archivos bonito. */
export const CV_FILES = [
  { id: 'top', file: 'README.md', label: 'Inicio' },
  { id: 'perfil', file: 'profile.md', label: 'Perfil' },
  { id: 'experiencia', file: 'timeline.json', label: 'Experiencia' },
  { id: 'proyectos', file: 'github.json', label: 'Proyectos' },
  { id: 'habilidades', file: 'skills.md', label: 'Habilidades' },
  { id: 'estudios', file: 'education.md', label: 'Estudios' },
  { id: 'contacto', file: 'contact.md', label: 'Contacto' },
  { id: 'package', file: 'package.json', label: 'package.json' },
] as const

export type CvFileId = (typeof CV_FILES)[number]['id']

/** Solo `README.md` al cargar; el resto se abre al elegirlo en el explorador o con hash #perfil, etc. */
export const INITIAL_TAB_IDS: CvFileId[] = ['top']

export function getFileEntry(id: CvFileId) {
  return CV_FILES.find((f) => f.id === id)!
}

export function isCvFileId(s: string): s is CvFileId {
  return CV_FILES.some((f) => f.id === s)
}

export function statusLanguageForFile(fileName: string): string {
  const ext = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  switch (ext) {
    case '.md':
      return 'Markdown'
    case '.ts':
    case '.tsx':
      return 'TypeScript'
    case '.json':
      return 'JSON'
    case '.config':
      return 'Config'
    case '.env':
      return 'Environment'
    default:
      return 'Plain Text'
  }
}
