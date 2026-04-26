import { cv } from '../../../data/cvData'

export function ProfileView() {
  return (
    <main id="perfil">
      <section className="cv-section cv-section--solo" aria-labelledby="perfil-title">
        <div className="cv-section__head">
          <h2 id="perfil-title" className="ide-func">
            {cv.copy.sections.perfil.heading}
          </h2>
          <p className="ide-comment cv-section__lede">{cv.copy.sections.perfil.lede}</p>
        </div>
        <div className="cv-prose">
          {cv.summary.map((paragraph, index) => (
            <p key={index}>
              <span className="ide-comment">// </span>
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </main>
  )
}
