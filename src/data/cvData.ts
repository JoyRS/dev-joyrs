/**
 * Contenido del portafolio.
 * - `src/content/cv.content.json` — perfil, proyectos, experiencia, textos, etc.
 * - `src/content/stack.preference.json` — stack técnico por capas (README / sección Stack).
 */
/* Menos buzzwords, más sistemas que aguantan carga real — la historia vive en el JSON, no en props mágicas. */
import cvContent from '../content/cv.content.json' with { type: 'json' }
import stackPreference from '../content/stack.preference.json' with { type: 'json' }

export const cv = {
  ...cvContent,
  stack: stackPreference,
}

export type Cv = typeof cv
