import { cv } from '../../../data/cvData'

export function ExperienceView() {
  return (
    <main id="experiencia">
      <section className="cv-section cv-section--solo" aria-labelledby="exp-title">
        <div className="cv-section__head">
          <h2 id="exp-title" className="ide-func">
            {cv.copy.sections.experiencia.heading}
          </h2>
          <p className="ide-comment cv-section__lede">
            {cv.copy.sections.experiencia.lede}
          </p>
        </div>
        <ol className="cv-timeline">
          {cv.experience.map((org) => (
            <li key={org.company} className="cv-timeline__item cv-timeline__item--org">
              <div className="cv-timeline__marker" aria-hidden />
              <div className="cv-timeline__card cv-timeline__card--org">
                <div className="cv-timeline__org-head">
                  <p className="ide-muted cv-timeline__company-line">
                    <span className="ide-keyword">@</span> {org.company}
                  </p>
                  <span className="ide-number cv-timeline__modality">{org.modality}</span>
                </div>
                {'client' in org && org.client ? (
                  <p className="ide-orange cv-timeline__client">{org.client}</p>
                ) : null}
                <div className="cv-timeline__roles">
                  {org.roles.map((role) => (
                    <div
                      key={`${role.title}-${role.period}`}
                      className="cv-timeline__role-block"
                    >
                      <div className="cv-timeline__meta">
                        <span className="ide-string cv-timeline__period">{role.period}</span>
                      </div>
                      <h3 className="ide-type cv-timeline__role">{role.title}</h3>
                      {'client' in role && role.client ? (
                        <p className="ide-orange cv-timeline__client">{role.client}</p>
                      ) : null}
                      <ul className="cv-timeline__bullets">
                        {role.bullets.map((b) => (
                          <li key={b}>
                            <span className="ide-comment">· </span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
