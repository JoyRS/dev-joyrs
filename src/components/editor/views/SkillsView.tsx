import { cv } from '../../../data/cvData'

export function SkillsView() {
  return (
    <main id="habilidades">
      <section className="cv-section cv-section--solo" aria-labelledby="skills-title">
        <div className="cv-section__head">
          <h2 id="skills-title" className="ide-func">
            {cv.copy.sections.habilidades.heading}
          </h2>
          <p className="ide-comment cv-section__lede">
            {cv.copy.sections.habilidades.lede}
          </p>
        </div>
        <ul className="cv-skills">
          {cv.skills.map((skill) => (
            <li key={skill}>
              <span className="ide-keyword">- </span>
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
