import { cv } from '../../../data/cvData'
import { StackHero } from '../../stack/StackHero'

export function ReadmeView() {
  return (
    <main id="top">
      <section className="cv-hero" aria-labelledby="hero-title">
        <p className="ide-comment cv-hero__kicker">{cv.copy.heroKicker}</p>
        <h1 id="hero-title" className="ide-type cv-hero__title">
          {cv.name}
          <span className="ide-caret" aria-hidden="true" />
        </h1>
        <p className="ide-func cv-hero__headline">{cv.headline}</p>
        <p className="ide-muted cv-hero__location">
          <span className="ide-keyword">const</span> location ={' '}
          <span className="ide-string">&apos;{cv.location}&apos;</span>
        </p>
        {cv.profiles.map((p) => (
          <p key={p.href} className="ide-muted cv-hero__location">
            <span className="ide-keyword">const</span> {p.label.toLowerCase()} ={' '}
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ide-string"
            >
              &apos;{p.href.replace(/^https:\/\/github\.com\//, '')}&apos;
            </a>
          </p>
        ))}
        <div className="cv-hero__focus-block">
          <h2 className="ide-func cv-hero__focus-h">{cv.copy.focusHeading}</h2>
          <p className="ide-comment cv-hero__focus-lede">{cv.copy.focusLede}</p>
          <ul className="cv-hero__focus-list">
            {cv.focus.map((item) => (
              <li key={item}>
                <span className="ide-keyword">- </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <StackHero />
      </section>
    </main>
  )
}
