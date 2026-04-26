import { useCallback, useEffect, useRef, useState } from 'react'
import { EditorBody } from '../components/editor/EditorBody'
import { IdeWindow } from '../components/ide/IdeWindow'
import {
  INITIAL_TAB_IDS,
  isCvFileId,
  type CvFileId,
} from '../config/cvFiles'
import { cv } from '../data/cvData'
import { useHashRouting } from '../hooks/useHashRouting'
import { useIdeTheme } from '../hooks/useIdeTheme'
import { PspWavesBackground } from '../components/ambient/PspWavesBackground'
import { useLineCount } from '../hooks/useLineCount'

function App() {
  const docRef = useRef<HTMLDivElement>(null)
  const tabScrollRef = useRef<HTMLDivElement>(null)
  const [openTabs, setOpenTabs] = useState<CvFileId[]>(() => [...INITIAL_TAB_IDS])
  const [activeTab, setActiveTab] = useState<CvFileId>(() => {
    const h = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
    return isCvFileId(h) ? h : 'top'
  })

  const ensureOpen = useCallback((id: CvFileId) => {
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  useHashRouting(activeTab, setActiveTab, ensureOpen)

  const focusFile = useCallback(
    (id: CvFileId) => {
      ensureOpen(id)
      setActiveTab(id)
    },
    [ensureOpen],
  )

  const selectTab = useCallback((id: CvFileId) => {
    setActiveTab(id)
  }, [])

  const goPrevTab = useCallback(() => {
    const i = openTabs.indexOf(activeTab)
    const prev = i <= 0 ? openTabs[openTabs.length - 1]! : openTabs[i - 1]!
    selectTab(prev)
  }, [openTabs, activeTab, selectTab])

  const goNextTab = useCallback(() => {
    const i = openTabs.indexOf(activeTab)
    const next = i < 0 || i >= openTabs.length - 1 ? openTabs[0]! : openTabs[i + 1]!
    selectTab(next)
  }, [openTabs, activeTab, selectTab])

  useEffect(() => {
    const scrollEl = tabScrollRef.current
    if (!scrollEl) return
    const wrap = scrollEl.querySelector(`[data-tab-id="${activeTab}"]`)
    wrap?.scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' })
  }, [activeTab])

  const closeTab = useCallback(
    (id: CvFileId) => {
      if (openTabs.length <= 1) return
      const idx = openTabs.indexOf(id)
      const nextTab = openTabs[idx + 1] ?? openTabs[idx - 1]
      setOpenTabs((prev) => prev.filter((t) => t !== id))
      if (activeTab === id && nextTab) {
        setActiveTab(nextTab)
      }
    },
    [activeTab, openTabs],
  )

  const lineCount = useLineCount(docRef, activeTab)
  const { theme, setTheme } = useIdeTheme()

  return (
    <>
      <div className="ide-psp-waves" aria-hidden="true">
        <PspWavesBackground theme={theme} />
      </div>
      <div className="ide-app">
        <IdeWindow
          openTabs={openTabs}
          activeTab={activeTab}
          lineCount={lineCount}
          tabScrollRef={tabScrollRef}
          docRef={docRef}
          ideTheme={theme}
          onIdeThemeChange={setTheme}
          onSelectTab={selectTab}
          onFocusFile={focusFile}
          onCloseTab={closeTab}
          onGoPrevTab={goPrevTab}
          onGoNextTab={goNextTab}
        >
          <EditorBody tabId={activeTab} />
          <footer className="cv-footer ide-comment">
            <p>
              © {new Date().getFullYear()} {cv.name} · <span className="ide-muted">{cv.copy.footerTag}</span>
            </p>
          </footer>
        </IdeWindow>
      </div>
    </>
  )
}

export default App
