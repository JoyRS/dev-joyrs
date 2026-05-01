import type { RefObject, ReactNode } from 'react'
import { CV_FILES, getFileEntry, statusLanguageForFile, type CvFileId } from '../../config/cvFiles'
import { IDE_THEMES, type IdeThemeId } from '../../config/ideThemes'
import { FileIcon } from '../icons/FileIcon'
import { TerminalPanel } from '../terminal/TerminalPanel'

type Props = {
  openTabs: CvFileId[]
  activeTab: CvFileId
  lineCount: number
  tabScrollRef: RefObject<HTMLDivElement | null>
  docRef: RefObject<HTMLDivElement | null>
  ideTheme: IdeThemeId
  onIdeThemeChange: (id: IdeThemeId) => void
  onSelectTab: (id: CvFileId) => void
  onFocusFile: (id: CvFileId) => void
  onCloseTab: (id: CvFileId) => void
  onGoPrevTab: () => void
  onGoNextTab: () => void
  children: ReactNode
}

export function IdeWindow({
  openTabs,
  activeTab,
  lineCount,
  tabScrollRef,
  docRef,
  onSelectTab,
  onFocusFile,
  onCloseTab,
  onGoPrevTab,
  onGoNextTab,
  ideTheme,
  onIdeThemeChange,
  children,
}: Props) {
  const activeFile = getFileEntry(activeTab)

  return (
    <div className="ide-window" role="application" aria-label="Vista estilo editor">
      <div className="ide-titlebar">
        <div className="ide-titlebar__start">
          <div className="ide-traffic" aria-hidden="true">
            <span className="ide-traffic__dot ide-traffic__dot--r" />
            <span className="ide-traffic__dot ide-traffic__dot--y" />
            <span className="ide-traffic__dot ide-traffic__dot--g" />
          </div>
        </div>
        <span className="ide-titlebar__title">cristhian-reis — Sublime Text</span>
        <div className="ide-titlebar__end">
          <a href="#top" className="ide-titlebar__logo-link" aria-label="Ir al inicio (README.md)" title="Inicio">
            <img src="/favicon.png" alt="" className="ide-titlebar__logo" width={18} height={18} decoding="async" />
          </a>
        </div>
      </div>

      <div className="ide-tabbar-outer">
        <button
          type="button"
          className="ide-tab-nav ide-tab-nav--prev"
          onClick={onGoPrevTab}
          aria-label="Archivo anterior"
          title="Anterior"
        >
          <span aria-hidden>‹</span>
        </button>
        <div className="ide-tabbar-scroll" ref={tabScrollRef}>
          <div className="ide-tabbar" role="tablist" aria-label="Archivos abiertos">
            {openTabs.map((id) => {
              const meta = getFileEntry(id)
              const isActive = id === activeTab
              return (
                <div
                  key={id}
                  data-tab-id={id}
                  className={`ide-tab-wrap ${isActive ? 'ide-tab-wrap--active' : ''}`}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    className={`ide-tab ${isActive ? 'ide-tab--active' : 'ide-tab--inactive'}`}
                    onClick={() => onSelectTab(id)}
                  >
                    <FileIcon fileName={meta.file} size={15} className="ide-tab__file-icon" />
                    <span className="ide-tab__name">{meta.file}</span>
                  </button>
                  <button
                    type="button"
                    className="ide-tab__close"
                    aria-label={`Cerrar ${meta.file}`}
                    title="Cerrar"
                    disabled={openTabs.length <= 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCloseTab(id)
                    }}
                  >
                    ×
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        <button
          type="button"
          className="ide-tab-nav ide-tab-nav--next"
          onClick={onGoNextTab}
          aria-label="Archivo siguiente"
          title="Siguiente"
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      <div className="ide-main">
        <aside className="ide-sidebar" aria-label="Explorador de archivos">
          <div className="ide-sidebar__header">EXPLORER</div>
          <div className="ide-sidebar__tree">
            <div className="ide-folder">
              <span className="ide-folder__name">
                <span className="ide-chevron" aria-hidden />
                ~/cv
              </span>
              <ul className="ide-files">
                {CV_FILES.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      aria-label={`Abrir ${item.label}: ${item.file}`}
                      className={`ide-file ${item.id === activeTab ? 'ide-file--active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        onFocusFile(item.id)
                      }}
                    >
                      <FileIcon fileName={item.file} size={15} className="ide-file__ico" />
                      {item.file}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="ide-editor-wrap">
          <div className="ide-editor">
            <div className="ide-gutter" aria-hidden="true">
              {Array.from({ length: lineCount }, (_, i) => (
                <span key={i} className="ide-gutter__ln">
                  {i + 1}
                </span>
              ))}
            </div>
            <div className="ide-doc">
              <div ref={docRef} className="ide-doc__measure">
                <div key={activeTab} className="ide-doc__view">
                  {children}
                </div>
              </div>
            </div>
          </div>

          <TerminalPanel
            onOpenFile={onFocusFile}
            currentTheme={ideTheme}
            onTheme={onIdeThemeChange}
          />

          <div className="ide-statusbar">
            <span className="ide-statusbar__item">Ln 1, Col 1</span>
            <span className="ide-statusbar__item">{lineCount} lines</span>
            <span className="ide-statusbar__item">UTF-8</span>
            <span className="ide-statusbar__item">{statusLanguageForFile(activeFile.file)}</span>
            <span className="ide-statusbar__item">Spaces: 2</span>
            <div className="ide-statusbar__item ide-statusbar__item--shrink ide-statusbar__theme">
              <label className="ide-theme-label">
                <span className="ide-visually-hidden">Tema de color</span>
                <select
                  className="ide-theme-select"
                  value={ideTheme}
                  onChange={(e) => onIdeThemeChange(e.target.value as IdeThemeId)}
                  aria-label="Tema de color"
                >
                  {IDE_THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <span className="ide-statusbar__item ide-statusbar__item--grow">{activeFile.file}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
