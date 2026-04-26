import { cv } from '../../../data/cvData'
import { useGitHubProjects } from '../../../hooks/useGitHubRepos'
import { formatRateLimitLine } from '../../../lib/github/githubRepos'
import { StackAsUnionType } from '../../stack/StackAsUnionType'

function formatPushed(s: string) {
  try {
    return new Date(s).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return s
  }
}

export function ProjectsView() {
  const { state, refetch, login } = useGitHubProjects()

  return (
    <main id="proyectos">
      <section className="cv-section cv-section--solo" aria-labelledby="proj-title">
        <div className="cv-section__head">
          <h2 id="proj-title" className="ide-func">
            {cv.copy.sections.proyectos.heading}
          </h2>
          <p className="ide-comment cv-section__lede">
            {cv.copy.sections.proyectos.lede}
          </p>
        </div>

        <p className="ide-comment" style={{ marginTop: 0, marginBottom: '0.75rem' }}>
          {login ? (
            <>
              Repositorios públicos vía API de GitHub{' '}
              <span className="ide-string">(@{login})</span>
              {state.status === 'ok' && state.data.fromCache && (
                <span className="ide-muted"> · datos en caché (navegador, ~20 min)</span>
              )}
            </>
          ) : null}
        </p>

        {state.status === 'loading' && (
          <p className="ide-comment" role="status">
            Cargando repositorios desde GitHub…
          </p>
        )}

        {state.status === 'error' && (
          <div>
            <p className="ide-keyword" style={{ marginBottom: '0.5rem' }}>
              {state.message}
            </p>
            {login && (
              <p className="ide-comment" style={{ marginBottom: '0.75rem' }}>
                Mostrando la lista fija de `cv.content.json` mientras tanto.
              </p>
            )}
            <div className="cv-projects">
              {cv.projects.map((proj) => (
                <StaticProjectCard key={proj.name} proj={proj} />
              ))}
            </div>
          </div>
        )}

        {state.status === 'ok' && (
          <>
            <div
              className="ide-github-meta"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.5rem 1rem',
                marginBottom: '0.75rem',
                fontSize: 11,
              }}
            >
              <span className="ide-comment">{formatRateLimitLine(state.data.rateLimit)}</span>
              <button
                type="button"
                className="ide-terminal__header-toggle"
                style={{ fontSize: 10, padding: '2px 8px' }}
                onClick={refetch}
                title="Fuerza nueva petición (ignora caché en sessionStorage)"
              >
                Actualizar
              </button>
            </div>
            {state.data.message && (
              <p className="ide-comment" style={{ marginBottom: '0.75rem' }}>
                {state.data.message}
              </p>
            )}
            {state.data.repos.length === 0 ? (
              <p className="ide-comment">No hay repositorios que mostrar con los filtros actuales.</p>
            ) : (
              <div className="cv-projects">
                {state.data.repos.map((r) => (
                  <article key={r.id} className="cv-project-card">
                    <h3 className="ide-type cv-project-card__title">{r.name}</h3>
                    <p className="cv-project-card__desc">{r.description}</p>
                    <p className="ide-comment cv-project-card__sub">// actividad</p>
                    <ul className="cv-project-card__highlights">
                      <li>
                        <span className="ide-keyword">→ </span>
                        Último push: {formatPushed(r.pushedAt)}
                        {r.stargazersCount > 0
                          ? ` · ${r.stargazersCount} estrella(s)`
                          : null}
                        {r.fork ? ' · fork' : null}
                        {r.languagesPartial ? ' · lenguajes parcial' : null}
                      </li>
                    </ul>
                    <p className="ide-comment cv-project-card__sub">// lenguajes (API)</p>
                    <p
                      className="ide-muted"
                      style={{ fontSize: 11, margin: '0 0 0.4rem', lineHeight: 1.45 }}
                    >
                      {r.languagePercents.map((x) => `${x.name} ${x.percent}%`).join(' · ')}
                    </p>
                    <StackAsUnionType
                      items={r.languageLabels}
                      typeName={`Repo${r.id}Stack`}
                    />
                    <a
                      className="cv-project-card__repo ide-string"
                      href={r.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {r.htmlUrl.replace(/^https?:\/\//, '')}
                    </a>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {state.status === 'ok' && state.data.repos.length > 0 && (
          <p className="ide-comment" style={{ marginTop: '1.25rem', fontSize: 11 }}>
            Excl. forks, archivados y privados. Caché ~20 min; `VITE_GITHUB_TOKEN` opcional (más
            cuota/hora en builds y local).
          </p>
        )}
      </section>
    </main>
  )
}

type StaticProj = (typeof cv.projects)[number]

function StaticProjectCard({ proj }: { proj: StaticProj }) {
  return (
    <article className="cv-project-card">
      <h3 className="ide-type cv-project-card__title">{proj.name}</h3>
      <p className="cv-project-card__desc">{proj.description}</p>
      <p className="ide-comment cv-project-card__sub">// highlights</p>
      <ul className="cv-project-card__highlights">
        {proj.highlights.map((h) => (
          <li key={h}>
            <span className="ide-keyword">→ </span>
            {h}
          </li>
        ))}
      </ul>
      <p className="ide-comment cv-project-card__sub">// stack</p>
      <StackAsUnionType items={proj.stack} typeName="ProjectTechnologies" />
      {proj.repo ? (
        <a
          className="cv-project-card__repo ide-string"
          href={proj.repo}
          target="_blank"
          rel="noopener noreferrer"
        >
          {proj.repo.replace(/^https?:\/\//, '')}
        </a>
      ) : (
        <p className="ide-comment cv-project-card__note">
          {'note' in proj && proj.note ? proj.note : '// Sin repositorio público'}
        </p>
      )}
    </article>
  )
}
