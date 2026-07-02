import { useCallback, useState } from 'react'
import type { AppData } from './types'
import { loadData, resetData, saveData } from './services/storage'
import { Home, type HomeTarget } from './screens/Home'
import { LessonRunner } from './screens/LessonRunner'
import { ParentArea } from './screens/ParentArea'
import { ReviewScreen } from './screens/ReviewScreen'
import { ChantFree, MatchFree, SortFree, TraceFree } from './screens/FreePlay'

type Screen = 'home' | HomeTarget

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData())
  const [screen, setScreen] = useState<Screen>('home')

  const apply = useCallback((change: (d: AppData) => AppData) => {
    setData((prev) => {
      const next = change(prev)
      saveData(next)
      return next
    })
  }, [])

  const goHome = useCallback(() => setScreen('home'), [])

  switch (screen) {
    case 'home':
      return <Home onGo={setScreen} />
    case 'lesson':
      return <LessonRunner data={data} apply={apply} onExit={goHome} />
    case 'trace':
      return <TraceFree apply={apply} onBack={goHome} />
    case 'match':
      return <MatchFree data={data} apply={apply} onBack={goHome} />
    case 'sort':
      return <SortFree data={data} apply={apply} onBack={goHome} />
    case 'chant':
      return <ChantFree onBack={goHome} />
    case 'review':
      return <ReviewScreen data={data} apply={apply} onBack={goHome} />
    case 'parent':
      return (
        <ParentArea
          data={data}
          onSettings={(change) =>
            apply((d) => ({ ...d, settings: { ...d.settings, ...change } }))
          }
          onReset={() => setData(resetData())}
          onBack={goHome}
        />
      )
  }
}
