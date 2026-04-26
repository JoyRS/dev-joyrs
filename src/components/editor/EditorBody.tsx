import type { CvFileId } from '../../config/cvFiles'
import { ContactView } from './views/ContactView'
import { EducationView } from './views/EducationView'
import { ExperienceView } from './views/ExperienceView'
import { PackageJsonView } from './views/PackageJsonView'
import { ProfileView } from './views/ProfileView'
import { ProjectsView } from './views/ProjectsView'
import { ReadmeView } from './views/ReadmeView'
import { SkillsView } from './views/SkillsView'

type Props = {
  tabId: CvFileId
}

export function EditorBody({ tabId }: Props) {
  switch (tabId) {
    case 'package':
      return <PackageJsonView />
    case 'top':
      return <ReadmeView />
    case 'perfil':
      return <ProfileView />
    case 'experiencia':
      return <ExperienceView />
    case 'proyectos':
      return <ProjectsView />
    case 'habilidades':
      return <SkillsView />
    case 'estudios':
      return <EducationView />
    case 'contacto':
      return <ContactView />
    default:
      return null
  }
}
