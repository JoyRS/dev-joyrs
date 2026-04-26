import { useEffect, useState } from 'react'
import {
  clearGitHubRepoCache,
  fetchPublicReposForUser,
  getGitHubLoginFromProfiles,
} from '../lib/github/githubRepos'
import type { GitHubFetchResult } from '../lib/github/types'
import { cv } from '../data/cvData'

type State =
  | { status: 'loading' }
  | { status: 'ok'; data: GitHubFetchResult; login: string }
  | { status: 'error'; message: string; login: string | null }

const profiles = cv.profiles as { label: string; href: string }[]

export function useGitHubProjects() {
  const login = getGitHubLoginFromProfiles(profiles)
  const [state, setState] = useState<State>(() => {
    if (!getGitHubLoginFromProfiles(profiles)) {
      return {
        status: 'error',
        message: 'No hay enlace a GitHub en el perfil (cv.profiles).',
        login: null,
      }
    }
    return { status: 'loading' }
  })

  useEffect(() => {
    if (!login) {
      return
    }
    setState({ status: 'loading' })
    let cancelled = false
    void fetchPublicReposForUser(login)
      .then((data) => {
        if (cancelled) return
        setState({ status: 'ok', data, login })
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const m = e instanceof Error ? e.message : 'Error al cargar GitHub.'
        setState({ status: 'error', message: m, login })
      })
    return () => {
      cancelled = true
    }
  }, [login])

  const refetch = () => {
    if (!login) return
    clearGitHubRepoCache(login)
    setState({ status: 'loading' })
    void fetchPublicReposForUser(login, { skipCache: true })
      .then((data) => setState({ status: 'ok', data, login }))
      .catch((e: unknown) => {
        const m = e instanceof Error ? e.message : 'Error al cargar GitHub.'
        setState({ status: 'error', message: m, login })
      })
  }

  return { state, refetch, login }
}
