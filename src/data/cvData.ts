/**
 * Contenido del portafolio.
 * - `src/content/cv.content.json` — perfil, proyectos, experiencia, textos, etc.
 * - `src/content/stack.preference.json` — stack técnico por capas (README / sección Stack).
 */
import cvContent from '../content/cv.content.json' with { type: 'json' }
import stackPreference from '../content/stack.preference.json' with { type: 'json' }

export const cv = {
  ...cvContent,
  stack: stackPreference,
}

export type Cv = typeof cv
