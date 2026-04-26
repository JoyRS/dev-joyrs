import { cv } from '../../../data/cvData'

export function EducationView() {
  return (
    <main id="estudios">
      <section className="cv-section cv-section--solo" aria-labelledby="edu-title">
        <div className="cv-section__head">
          <h2 id="edu-title" className="ide-func">
            {cv.copy.sections.estudios.heading}
          </h2>
        </div>
        <article className="cv-edu">
          <h3 className="ide-type cv-edu__degree">{cv.education.degree}</h3>
          <p className="ide-string cv-edu__school">{cv.education.school}</p>
          <p className="ide-muted cv-edu__meta">
            <span className="ide-keyword">{cv.copy.educationWhereKeyword}</span>{' '}
            {cv.education.location} · {cv.education.years}
          </p>
        </article>
        <div className="cv-certs">
          <h3 className="ide-comment cv-certs__title">{cv.copy.certificationsHeading}</h3>
          <ul className="cv-certs__list">
            {cv.certifications.map((c) => (
              <li key={c}>
                <span className="ide-comment"># </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
