import { escapeTsStringLiteral } from './stackUtils'

type Props = {
  items: string[]
  typeName: string
}

export function StackAsUnionType({ items, typeName }: Props) {
  return (
    <div className="cv-stack-type-block">
      <div className="cv-stack-type-decl">
        <span className="ide-keyword">type</span>{' '}
        <span className="ide-type">{typeName}</span>
        <span className="ide-muted"> =</span>
      </div>
      {items.map((tech, idx) => (
        <div key={`${typeName}-${tech}-${idx}`} className="cv-stack-union-line">
          <span className="ide-muted">{'  | '}</span>
          <span className="ide-string">&apos;{escapeTsStringLiteral(tech)}&apos;</span>
          {idx === items.length - 1 ? <span className="ide-muted">;</span> : null}
        </div>
      ))}
    </div>
  )
}
