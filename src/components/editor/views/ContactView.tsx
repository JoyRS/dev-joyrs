import { FaUser } from 'react-icons/fa'
import { SiGithub } from 'react-icons/si'
import { cv } from '../../../data/cvData'
import { FlyingBirdIcon } from '../../icons/FlyingBirdIcon'

export function ContactView() {
  return (
    <main id="contacto">
      <section
        className="cv-section cv-section--solo cv-section--contact"
        aria-labelledby="contact-title"
      >
        <div className="cv-section__head">
          <h2 id="contact-title" className="ide-func">
            {cv.copy.sections.contacto.heading}
          </h2>
          <p className="ide-comment cv-section__lede">{cv.copy.sections.contacto.lede}</p>
        </div>
        <div className="cv-contact">
          {cv.emails.map((e) => (
            <a key={e.href} className="cv-contact__link" href={e.href}>
              <span className="cv-contact__labelRow">
                {e.label === 'Albatros' ? (
                  <FlyingBirdIcon className="cv-contact__icon cv-contact__icon--bird" />
                ) : e.label === 'Personal' ? (
                  <FaUser className="cv-contact__icon cv-contact__icon--person" size={14} aria-hidden />
                ) : null}
                <span className="ide-keyword cv-contact__label">{e.label}</span>
              </span>
              <span className="ide-string cv-contact__value">
                {e.href.replace('mailto:', '')}
              </span>
            </a>
          ))}
          {cv.profiles.map((p) => (
            <a
              key={p.href}
              className="cv-contact__link cv-contact__link--external"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="cv-contact__labelRow">
                {p.label === 'GitHub' ? (
                  <SiGithub className="cv-contact__icon" size={15} aria-hidden />
                ) : null}
                <span className="ide-keyword cv-contact__label">{p.label}</span>
              </span>
              <span className="ide-string cv-contact__value">
                {p.href.replace(/^https?:\/\//, '')}
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
