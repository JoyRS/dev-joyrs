import type { IconType } from 'react-icons/lib'
import { SiDotenv, SiMarkdown, SiNpm, SiTypescript } from 'react-icons/si'
import { VscFile, VscJson, VscSettingsGear } from 'react-icons/vsc'

type FileIconProps = {
  fileName: string
  size?: number
  className?: string
}

function extOf(fileName: string) {
  if (!fileName.includes('.')) return ''
  return fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
}

const wrap = (
  Icon: IconType,
  className: string | undefined,
  size: number,
  extra?: string,
) => (
  <Icon
    className={[className, extra].filter(Boolean).join(' ')}
    size={size}
    aria-hidden
  />
)

export function FileIcon({ fileName, size = 14, className }: FileIconProps) {
  const ext = extOf(fileName)

  if (fileName === 'package.json') {
    return wrap(SiNpm, className, size, 'file-icon file-icon--npm')
  }

  switch (ext) {
    case '.md':
      return wrap(SiMarkdown, className, size, 'file-icon file-icon--md')
    case '.ts':
    case '.tsx':
      return wrap(SiTypescript, className, size, 'file-icon file-icon--ts')
    case '.json':
      return wrap(VscJson, className, size, 'file-icon file-icon--json')
    case '.config':
      return wrap(VscSettingsGear, className, size, 'file-icon file-icon--config')
    case '.env':
      return wrap(SiDotenv, className, size, 'file-icon file-icon--env')
    default:
      return wrap(VscFile, className, size, 'file-icon file-icon--fallback')
  }
}
