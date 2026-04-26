export type GitHubRateLimit = {
  limit: number
  remaining: number
  reset: number
}

export type GitHubApiRepo = {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  private: boolean
  fork: boolean
  archived: boolean
  language: string | null
  stargazers_count: number
  pushed_at: string
}

export type GitHubRepoDisplay = {
  id: number
  name: string
  fullName: string
  description: string
  htmlUrl: string
  pushedAt: string
  stargazersCount: number
  fork: boolean
  languagePrimary: string | null
  languageLabels: string[]
  languagePercents: { name: string; percent: number }[]
  languagesPartial: boolean
}

export type GitHubFetchResult = {
  repos: GitHubRepoDisplay[]
  rateLimit: GitHubRateLimit
  fromCache: boolean
  usedPrimaryLanguageOnly: boolean
  message: string | null
}
