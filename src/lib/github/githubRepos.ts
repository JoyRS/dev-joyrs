import type {
  GitHubApiRepo,
  GitHubFetchResult,
  GitHubRateLimit,
  GitHubRepoDisplay,
} from './types'

const API_BASE = 'https://api.github.com'
const GITHUB_VERSION = '2022-11-28'
const CACHE_PREFIX = 'gh:portafolio:repos'
const CACHE_TTL_MS = 20 * 60 * 1000
const MIN_REMAINING_BEFORE_LANG = 3
const LANGUAGE_FETCH_STAGGER_MS = 50

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export function readRateLimitFromHeaders(h: Headers): GitHubRateLimit {
  return {
    limit: Number(h.get('X-RateLimit-Limit') ?? 60) || 60,
    remaining: Number(h.get('X-RateLimit-Remaining') ?? 0) || 0,
    reset: Number(h.get('X-RateLimit-Reset') ?? 0) || 0,
  }
}

function authHeaders(): Headers {
  const h: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_VERSION,
  }
  const t = import.meta.env.VITE_GITHUB_TOKEN
  if (t && t.trim() !== '') {
    h.Authorization = `Bearer ${t.trim()}`
  }
  return new Headers(h)
}

async function ghRequest(url: string): Promise<{ res: Response; rateLimit: GitHubRateLimit; json: unknown }> {
  const res = await fetch(url, { headers: authHeaders() })
  const rateLimit = readRateLimitFromHeaders(res.headers)
  if (!res.ok) {
    const errText = await res.text().catch(() => '')
    const err = new Error(errText || `HTTP ${res.status}`) as Error & { status?: number; rateLimit: GitHubRateLimit }
    err.status = res.status
    err.rateLimit = rateLimit
    throw err
  }
  const json = (await res.json()) as unknown
  return { res, rateLimit, json }
}

function parseLoginFromProfileUrl(href: string): string | null {
  try {
    const u = new URL(href, 'https://github.com')
    if (!u.hostname.includes('github.com')) return null
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts[0] && !['orgs', 'settings', 'org'].includes(parts[0]!)) {
      return parts[0]!
    }
  } catch {
    /* empty */
  }
  return null
}

export function getGitHubLoginFromProfiles(profiles: { label: string; href: string }[]): string | null {
  for (const p of profiles) {
    if (p.label.toLowerCase() === 'github' || p.href.includes('github.com')) {
      const l = parseLoginFromProfileUrl(p.href)
      if (l) return l
    }
  }
  return null
}

function toDisplay(
  r: GitHubApiRepo,
  languageLabels: string[],
  languagePercents: { name: string; percent: number }[],
  languagesPartial: boolean,
): GitHubRepoDisplay {
  return {
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: (r.description ?? '').trim() || '// Sin descripción en GitHub',
    htmlUrl: r.html_url,
    pushedAt: r.pushed_at,
    stargazersCount: r.stargazers_count,
    fork: r.fork,
    languagePrimary: r.language,
    languageLabels,
    languagePercents,
    languagesPartial,
  }
}

function mapLanguagesToPercents(
  map: Record<string, number> | null,
  primary: string | null,
): { labels: string[]; percents: { name: string; percent: number }[]; partial: false } {
  if (!map || Object.keys(map).length === 0) {
    const p = primary?.trim() || 'Desconocido'
    return {
      labels: [p],
      percents: [{ name: p, percent: 100 }],
      partial: false,
    }
  }
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1])
  const total = entries.reduce((s, [, n]) => s + n, 0)
  const percents = entries.map(([name, bytes]) => ({
    name,
    percent: total > 0 ? Math.round((bytes / total) * 1000) / 10 : 0,
  }))
  return {
    labels: entries.map(([name]) => name),
    percents,
    partial: false,
  }
}

type CacheEntry = { at: number; result: GitHubFetchResult }

function readCache(username: string): GitHubFetchResult | null {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const k = `${CACHE_PREFIX}:${username}`
    const raw = sessionStorage.getItem(k)
    if (!raw) return null
    const c = JSON.parse(raw) as CacheEntry
    if (Date.now() - c.at > CACHE_TTL_MS) return null
    return { ...c.result, fromCache: true }
  } catch {
    return null
  }
}

function writeCache(username: string, result: GitHubFetchResult) {
  if (typeof sessionStorage === 'undefined') return
  try {
    const k = `${CACHE_PREFIX}:${username}`
    const payload: CacheEntry = { at: Date.now(), result: { ...result, fromCache: true } }
    sessionStorage.setItem(k, JSON.stringify(payload))
  } catch {
    /* quota */
  }
}

/**
 * Carga repositorios públicos del usuario y, si el rate limit lo permite, el desglose de lenguajes por repo.
 * Respeta `X-RateLimit-Remaining` y baja a solo lenguaje principal cuando el cupo se agota.
 */
export async function fetchPublicReposForUser(
  login: string,
  options: { useCache?: boolean; skipCache?: boolean } = {},
): Promise<GitHubFetchResult> {
  if (options.useCache !== false && !options.skipCache) {
    const cached = readCache(login)
    if (cached) return cached
  }

  let usedPrimaryLanguageOnly = false
  let message: string | null = null
  const apiRepos: GitHubApiRepo[] = []
  let rateLimit: GitHubRateLimit = { limit: 60, remaining: 60, reset: 0 }
  const listPath = (page: number) =>
    `${API_BASE}/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated&page=${page}`

  try {
  for (let page = 1; page <= 10; page += 1) {
    if (rateLimit.remaining < 1) {
      message = 'Cuota de la API de GitHub agotada. Restablecimiento: '
      break
    }
    const { rateLimit: rl, json } = await ghRequest(listPath(page))
    rateLimit = rl
    const chunk = json as GitHubApiRepo[]
    if (!Array.isArray(chunk) || chunk.length === 0) break
    for (const r of chunk) {
      if (r.fork) continue
      if (r.private || r.archived) continue
      apiRepos.push(r)
    }
    if (chunk.length < 100) break
  }
  } catch (e) {
    const err = e as Error & { status?: number; rateLimit?: GitHubRateLimit }
    if (err.rateLimit) rateLimit = err.rateLimit
    return {
      repos: [],
      rateLimit: err.rateLimit ?? rateLimit,
      fromCache: false,
      usedPrimaryLanguageOnly: false,
      message:
        err.status === 403
          ? `Acceso a la API de GitHub limitado. Restablece: ${
              err.rateLimit?.reset
                ? new Date(err.rateLimit.reset * 1000).toLocaleString('es-PE')
                : '—'
            }`
          : (err.message ?? 'No se pudo cargar repositorios desde GitHub.'),
    }
  }

  if (apiRepos.length === 0) {
    return {
      repos: [],
      rateLimit,
      fromCache: false,
      usedPrimaryLanguageOnly: false,
      message: 'No se encontraron repositorios públicos (excl. forks, archivados, privados).',
    }
  }

  const displays: GitHubRepoDisplay[] = []
  for (const r of apiRepos) {
    if (rateLimit.remaining < MIN_REMAINING_BEFORE_LANG) {
      usedPrimaryLanguageOnly = true
      const m = mapLanguagesToPercents(null, r.language)
      displays.push(toDisplay(r, m.labels, m.percents, true))
      continue
    }
    if (r.language) {
      const [own, reponame] = r.full_name.split('/')
      if (!own || !reponame) {
        const m = mapLanguagesToPercents(null, r.language)
        displays.push(toDisplay(r, m.labels, m.percents, true))
        continue
      }
      const langUrl = `${API_BASE}/repos/${encodeURIComponent(own)}/${encodeURIComponent(reponame)}/languages`
      try {
        const { rateLimit: rl, json: langMap } = await ghRequest(langUrl)
        rateLimit = rl
        if (langMap && typeof langMap === 'object' && !Array.isArray(langMap)) {
          const m = mapLanguagesToPercents(langMap as Record<string, number>, r.language)
          displays.push(toDisplay(r, m.labels, m.percents, false))
        } else {
          const m = mapLanguagesToPercents(null, r.language)
          displays.push(toDisplay(r, m.labels, m.percents, true))
        }
      } catch {
        usedPrimaryLanguageOnly = true
        const m = mapLanguagesToPercents(null, r.language)
        displays.push(toDisplay(r, m.labels, m.percents, true))
      }
    } else {
      const { labels, percents } = mapLanguagesToPercents(null, null)
      displays.push(toDisplay(r, labels, percents, true))
    }
    if (rateLimit.remaining < 2) {
      usedPrimaryLanguageOnly = true
    }
    await sleep(LANGUAGE_FETCH_STAGGER_MS)
  }

  if (message && rateLimit.reset) {
    message += new Date(rateLimit.reset * 1000).toLocaleString('es-PE')
  }

  if (!message && usedPrimaryLanguageOnly) {
    message =
      'Se usó el lenguaje principal de GitHub en parte de los repos para respetar el rate limit (cuota baja o error en un lenguaje). Con VITE_GITHUB_TOKEN la cuota sube a 5.000/h.'
  }

  const result: GitHubFetchResult = {
    repos: displays,
    rateLimit,
    fromCache: false,
    usedPrimaryLanguageOnly,
    message: message || null,
  }

  writeCache(login, result)
  return result
}

/** Invalida caché (por ejemplo al pulsar "Actualizar" en el futuro). */
export function clearGitHubRepoCache(username: string) {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(`${CACHE_PREFIX}:${username}`)
  } catch {
    /* empty */
  }
}

export function formatRateLimitLine(rl: GitHubRateLimit): string {
  const reset = rl.reset
    ? new Date(rl.reset * 1000).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
    : '—'
  return `API GitHub: ${rl.remaining} / ${rl.limit} restantes (restablece: ${reset})`
}

export { parseLoginFromProfileUrl }
