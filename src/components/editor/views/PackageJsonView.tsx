import pkg from '../../../../package.json' with { type: 'json' }
import { cv } from '../../../data/cvData'

export function PackageJsonView() {
  const raw = JSON.stringify(pkg, null, 2)
  return (
    <main id="top">
      <p className="ide-comment">{cv.copy.packageJsonComment}</p>
      <pre className="ide-json-block">{raw}</pre>
    </main>
  )
}
