import { cv } from '../../data/cvData'
import { StackAsUnionType } from './StackAsUnionType'
import { isStackByCategory, stackCategoryTypeName } from './stackUtils'

export function StackHero() {
  const stack = cv.stack
  if (!isStackByCategory(stack)) {
    const items = stack as string[]
    return (
      <div className="cv-stack-hero" aria-label={cv.copy.heroStackAriaLabel}>
        <h2 className="ide-func cv-hero__stack-title">{cv.copy.stackHeading}</h2>
        <p className="ide-comment cv-hero__stack-lede">{cv.copy.stackLede}</p>
        <p className="ide-comment cv-stack-group__label">// stack</p>
        <StackAsUnionType items={items} typeName="Stack" />
      </div>
    )
  }

  const labels = cv.copy.stackCategoryLabels

  return (
    <div className="cv-stack-hero" aria-label={cv.copy.heroStackAriaLabel}>
      <h2 className="ide-func cv-hero__stack-title">{cv.copy.stackHeading}</h2>
      <p className="ide-comment cv-hero__stack-lede">{cv.copy.stackLede}</p>
      {Object.entries(stack).map(([key, items]) => {
        const label =
          labels[key as keyof typeof labels] !== undefined
            ? labels[key as keyof typeof labels]
            : key
        return (
          <div key={key} className="cv-stack-group">
            <p className="ide-comment cv-stack-group__label">// {label}</p>
            <StackAsUnionType items={items} typeName={stackCategoryTypeName(key)} />
          </div>
        )
      })}
    </div>
  )
}
