export function isStackByCategory(
  stack: unknown,
): stack is Record<string, string[]> {
  return (
    typeof stack === 'object' &&
    stack !== null &&
    !Array.isArray(stack) &&
    Object.values(stack).every(
      (v) => Array.isArray(v) && v.every((x) => typeof x === 'string'),
    )
  )
}

export function escapeTsStringLiteral(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export function stackCategoryTypeName(key: string): string {
  const pascal = key
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('')
  return `Stack${pascal || 'Layer'}`
}
