import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Gauge,
  Keyboard,
  RefreshCw,
  Target,
} from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import { type TypingMode } from '../api/results'
import { getDefaultTexts, type Difficulty, type TypingText } from '../api/texts'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import type { CompletedTestResult } from '../types/testResult'

type TestStatus = 'idle' | 'running' | 'finished'
type TextSize = 'comfort' | 'large' | 'extra'

type PracticeLocationState = {
  practiceText?: TypingText
}

type MetricProps = {
  label: string
  value: string | number
  icon: ReactNode
  tone?: 'cyan' | 'emerald' | 'amber' | 'rose'
}

const textSizeStorageKey = 'typing_text_size'
const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
const modes: TypingMode[] = ['timed', 'passage']
const textSizes: Array<{ value: TextSize; label: string; className: string }> =
  [
    {
      value: 'comfort',
      label: 'Comfort',
      className: 'typing-size-comfort',
    },
    {
      value: 'large',
      label: 'Large',
      className: 'typing-size-large',
    },
    {
      value: 'extra',
      label: 'Extra large',
      className: 'typing-size-extra',
    },
  ]
const timedLimitSeconds = 60

const FALLBACK_TEXTS: TypingText[] = [
  {
    id: 'local-focus-baseline',
    title: 'Focused Baseline',
    content:
      'Typing speed improves when practice is deliberate, measured, and calm. Keep your eyes ahead of the cursor, let mistakes pass without panic, and finish each session with one clear thing to improve next time.',
    difficulty: 'MEDIUM',
    source_type: 'DEFAULT',
    wordCount: 31,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'local-product-rhythm',
    title: 'Product Rhythm',
    content:
      'A professional tool should feel steady under pressure. The interface must keep important numbers visible, make the next action obvious, and avoid distracting the person doing focused work.',
    difficulty: 'EASY',
    source_type: 'DEFAULT',
    wordCount: 28,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const formatDifficulty = (difficulty: string) =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()

const getCorrectCharacters = (typed: string, content: string) =>
  typed.split('').filter((character, index) => character === content[index])
    .length

const getWordCount = (content: string) =>
  content.trim().split(/\s+/).filter(Boolean).length

const readStoredTextSize = (): TextSize => {
  if (typeof window === 'undefined') return 'large'
  const value = window.localStorage.getItem(textSizeStorageKey)
  return value === 'comfort' || value === 'large' || value === 'extra'
    ? value
    : 'large'
}

const Metric = ({ label, value, icon, tone = 'cyan' }: MetricProps) => {
  const toneClasses = {
    cyan: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/45 dark:text-cyan-200',
    emerald:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-200',
    amber:
      'bg-amber-50 text-amber-700 dark:bg-amber-950/45 dark:text-amber-200',
    rose: 'bg-rose-50 text-rose-700 dark:bg-rose-950/45 dark:text-rose-200',
  }

  return (
    <div className='app-surface rounded-lg p-2.5 sm:p-4'>
      <div className='flex items-center gap-2 sm:gap-3'>
        <span
          className={`hidden h-10 w-10 place-items-center rounded-md sm:grid ${toneClasses[tone]}`}
        >
          {icon}
        </span>
        <div className='min-w-0'>
          <p className='truncate text-[0.64rem] font-bold uppercase tracking-wide app-muted sm:text-xs'>
            {label}
          </p>
          <p className='mt-0.5 truncate text-lg font-black app-text sm:mt-1 sm:text-2xl'>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

export const TypingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as PracticeLocationState | null
  const practiceText = locationState?.practiceText
  const { isAuthenticated, user } = useAuth()
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const hasNavigatedToResult = useRef(false)
  const [difficulty, setDifficulty] = useState<Difficulty>('medium')
  const [mode, setMode] = useState<TypingMode>('timed')
  const [textSize, setTextSize] = useState<TextSize>(readStoredTextSize)
  const [texts, setTexts] = useState<TypingText[]>([])
  const [selectedTextId, setSelectedTextId] = useState('')
  const [isLoadingTexts, setIsLoadingTexts] = useState(true)
  const [textError, setTextError] = useState('')
  const [typed, setTyped] = useState('')
  const [totalKeyPresses, setTotalKeyPresses] = useState(0)
  const [status, setStatus] = useState<TestStatus>('idle')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    window.localStorage.setItem(textSizeStorageKey, textSize)
  }, [textSize])

  useEffect(() => {
    if (!practiceText) return

    setTexts([practiceText])
    setSelectedTextId(practiceText.id)
    setDifficulty(practiceText.difficulty.toLowerCase() as Difficulty)
    setTextError('')
    setIsLoadingTexts(false)
    setStatus('idle')
    setTyped('')
    setElapsedSeconds(0)
    setTotalKeyPresses(0)
    hasNavigatedToResult.current = false
  }, [practiceText])

  useEffect(() => {
    if (practiceText) return

    let ignore = false
    setIsLoadingTexts(true)
    setTextError('')

    getDefaultTexts(difficulty)
      .then((payload) => {
        if (ignore) return

        const nextTexts = payload.texts.length ? payload.texts : FALLBACK_TEXTS
        setTexts(nextTexts)
        setSelectedTextId((previous) =>
          nextTexts.some((text) => text.id === previous)
            ? previous
            : (nextTexts[0]?.id ?? ''),
        )
      })
      .catch((error) => {
        if (ignore) return
        setTexts(FALLBACK_TEXTS)
        setSelectedTextId(FALLBACK_TEXTS[0]?.id ?? '')
        setTextError(getApiErrorMessage(error, 'Could not load backend texts.'))
      })
      .finally(() => {
        if (!ignore) setIsLoadingTexts(false)
      })

    return () => {
      ignore = true
    }
  }, [difficulty, practiceText])

  const activeText = useMemo(
    () => texts.find((text) => text.id === selectedTextId) ?? texts[0],
    [selectedTextId, texts],
  )

  const content = activeText?.content ?? ''
  const correctCharacters = useMemo(
    () => getCorrectCharacters(typed, content),
    [content, typed],
  )
  const incorrectCharacters = Math.max(totalKeyPresses - correctCharacters, 0)
  const effectiveDuration = Math.max(elapsedSeconds, status === 'idle' ? 0 : 1)
  const wpm =
    effectiveDuration > 0
      ? Math.floor(correctCharacters / 5 / (effectiveDuration / 60))
      : 0
  const accuracy =
    totalKeyPresses > 0
      ? Math.floor((correctCharacters / totalKeyPresses) * 100)
      : 100
  const remainingSeconds = Math.max(timedLimitSeconds - elapsedSeconds, 0)
  const progress = content
    ? Math.min(Math.round((typed.length / content.length) * 100), 100)
    : 0
  const activeTextSize =
    textSizes.find((size) => size.value === textSize) ?? textSizes[1]

  const resetTest = useCallback(() => {
    setTyped('')
    setTotalKeyPresses(0)
    setStatus('idle')
    setElapsedSeconds(0)
    hasNavigatedToResult.current = false
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    resetTest()
  }, [mode, selectedTextId, resetTest])

  useEffect(() => {
    if (status !== 'running') return

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1)
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [status])

  useEffect(() => {
    if (status !== 'running') return
    if (mode === 'timed' && elapsedSeconds >= timedLimitSeconds) {
      setStatus('finished')
    }
  }, [elapsedSeconds, mode, status])

  useEffect(() => {
    if (status !== 'running' || !content) return
    if (typed.length >= content.length) {
      setStatus('finished')
    }
  }, [content, status, typed.length])

  useEffect(() => {
    if (status !== 'finished' || !activeText || hasNavigatedToResult.current) {
      return
    }

    hasNavigatedToResult.current = true
    const durationSeconds = Math.max(effectiveDuration, 1)
    const result: CompletedTestResult = {
      textId: activeText.id.startsWith('local-') ? undefined : activeText.id,
      textTitle: activeText.title,
      mode,
      durationSeconds,
      wpm,
      accuracy,
      correctCharacters,
      incorrectCharacters,
      totalKeyPresses,
      progress,
      wordCount: activeText.wordCount || getWordCount(content),
      completedAt: new Date().toISOString(),
      saveStatus: isAuthenticated ? 'saving' : 'guest',
    }

    navigate('/result', { replace: true, state: { result } })
  }, [
    accuracy,
    activeText,
    content,
    correctCharacters,
    effectiveDuration,
    incorrectCharacters,
    isAuthenticated,
    mode,
    navigate,
    progress,
    status,
    totalKeyPresses,
    wpm,
  ])

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!content || status === 'finished') return

    const nextValue = event.target.value.slice(0, content.length)

    if (status === 'idle') {
      setStatus('running')
    }

    if (nextValue.length > typed.length) {
      setTotalKeyPresses((presses) => presses + nextValue.length - typed.length)
    }

    setTyped(nextValue)
  }

  const focusTypingArea = () => {
    inputRef.current?.focus()
  }

  return (
    <main className='app-page py-4 sm:py-8'>
      <div className='app-shell'>
        <section className='mb-4 flex flex-col justify-between gap-3 sm:mb-8 lg:flex-row lg:items-end'>
          <div>
            <p className='mb-3 inline-flex items-center gap-2 rounded-md app-surface px-3 py-2 text-sm font-bold app-muted'>
              <Keyboard size={17} />
              {isAuthenticated ? `${user?.name}'s workspace` : 'Guest practice'}
            </p>
            <h1 className='text-3xl font-black tracking-normal app-text sm:text-5xl'>
              Measure speed without losing focus.
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-6 app-muted sm:mt-4 sm:text-base sm:leading-7'>
              Choose a passage, start typing, and review a full result page when
              you finish.
            </p>
          </div>

          {!isAuthenticated && (
            <div className='rounded-lg border border-amber-300/70 bg-amber-100 p-4 text-sm font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100'>
              Results are local in guest mode.{' '}
              <Link
                to='/login'
                className='font-black text-cyan-800 underline dark:text-cyan-200'
              >
                Login to save history.
              </Link>
            </div>
          )}
        </section>

        <section className='mb-3 grid grid-cols-4 gap-2 sm:mb-5 sm:gap-4'>
          <Metric label='WPM' value={wpm} icon={<Gauge size={20} />} />
          <Metric
            label='Accuracy'
            value={`${accuracy}%`}
            icon={<Target size={20} />}
            tone={accuracy >= 90 ? 'emerald' : 'amber'}
          />
          <Metric
            label={mode === 'timed' ? 'Time left' : 'Elapsed'}
            value={
              mode === 'timed' ? `${remainingSeconds}s` : `${elapsedSeconds}s`
            }
            icon={<Clock3 size={20} />}
            tone='amber'
          />
          <Metric
            label='Progress'
            value={`${progress}%`}
            icon={<CheckCircle2 size={20} />}
            tone={incorrectCharacters ? 'rose' : 'emerald'}
          />
        </section>

        <section className='grid gap-4 sm:gap-5'>
          <section className='app-surface rounded-lg p-3 sm:p-4'>
            <div className='grid gap-3 lg:grid-cols-[minmax(220px,1fr)_auto_auto_auto] lg:items-end'>
              <label className='block'>
                <span className='text-xs font-black uppercase tracking-wide app-muted'>
                  Passage
                </span>
                <select
                  value={selectedTextId}
                  onChange={(event) => setSelectedTextId(event.target.value)}
                  disabled={status === 'running' || isLoadingTexts}
                  className='app-input mt-2 h-10 w-full rounded-md px-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 sm:h-11'
                >
                  {texts.map((text) => (
                    <option key={text.id} value={text.id}>
                      {text.title}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <p className='text-xs font-black uppercase tracking-wide app-muted'>
                  Difficulty
                </p>
                <div className='mt-2 grid grid-cols-3 gap-2'>
                  {difficulties.map((item) => (
                    <button
                      key={item}
                      type='button'
                      disabled={status === 'running' || Boolean(practiceText)}
                      onClick={() => setDifficulty(item)}
                      className={[
                        'h-10 rounded-md border px-2 text-xs font-black capitalize transition disabled:cursor-not-allowed disabled:opacity-60 sm:px-3 sm:text-sm',
                        difficulty === item
                          ? 'border-cyan-600 bg-cyan-600 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950'
                          : 'app-input hover:bg-[var(--surface-soft)]',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className='text-xs font-black uppercase tracking-wide app-muted'>
                  Mode
                </p>
                <div className='mt-2 grid grid-cols-2 gap-2'>
                  {modes.map((item) => (
                    <button
                      key={item}
                      type='button'
                      disabled={status === 'running'}
                      onClick={() => setMode(item)}
                      className={[
                        'h-10 rounded-md border px-3 text-xs font-black capitalize transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm',
                        mode === item
                          ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                          : 'app-input hover:bg-[var(--surface-soft)]',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className='text-xs font-black uppercase tracking-wide app-muted'>
                  Text size
                </p>
                <div className='mt-2 grid grid-cols-3 gap-2'>
                  {textSizes.map((size) => (
                    <button
                      key={size.value}
                      type='button'
                      onClick={() => setTextSize(size.value)}
                      className={[
                        'h-10 rounded-md border px-2 text-xs font-black transition sm:px-3 sm:text-sm',
                        textSize === size.value
                          ? 'border-cyan-600 bg-cyan-600 text-white dark:border-cyan-300 dark:bg-cyan-300 dark:text-slate-950'
                          : 'app-input hover:bg-[var(--surface-soft)]',
                      ].join(' ')}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className='app-surface rounded-lg p-4 sm:p-6'>
            <div className='mb-4 flex flex-col gap-3 border-b app-border pb-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='text-xl font-black app-text'>
                  {activeText?.title ?? 'Loading passage'}
                </h2>
                <p className='mt-1 text-sm font-medium app-muted'>
                  {activeText
                    ? `${formatDifficulty(activeText.difficulty)} - ${
                        activeText.wordCount || getWordCount(content)
                      } words - ${progress}% complete`
                    : 'Preparing your test'}
                </p>
              </div>
              <Button
                type='button'
                variant='secondary'
                onClick={resetTest}
                icon={<RefreshCw size={17} />}
              >
                Restart
              </Button>
            </div>

            {textError && (
              <div className='mb-4 flex items-start gap-2 rounded-md border border-amber-300/70 bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100'>
                <AlertCircle className='mt-0.5 shrink-0' size={17} />
                <span>{textError} Using a local practice passage for now.</span>
              </div>
            )}

            <button
              type='button'
              onClick={focusTypingArea}
              className={`typing-text min-h-[18rem] w-full cursor-text rounded-md app-surface-soft p-3 text-left ${activeTextSize.className} outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 sm:min-h-[24rem] sm:p-6`}
            >
              {isLoadingTexts ? (
                <span className='text-base app-muted'>Loading passages...</span>
              ) : (
                content.split('').map((character, index) => {
                  const isTyped = index < typed.length
                  const isCurrent =
                    index === typed.length && status !== 'finished'
                  const isCorrect = typed[index] === character

                  return (
                    <span
                      key={index}
                      className={[
                        'rounded-sm',
                        isTyped && isCorrect
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : '',
                        isTyped && !isCorrect
                          ? 'bg-rose-200 text-rose-900 underline decoration-rose-700 dark:bg-rose-950 dark:text-rose-200 dark:decoration-rose-300'
                          : '',
                        !isTyped ? 'text-[var(--muted-strong)]' : '',
                        isCurrent
                          ? 'bg-cyan-300 text-slate-950 dark:bg-cyan-300 dark:text-slate-950'
                          : '',
                      ].join(' ')}
                    >
                      {character}
                    </span>
                  )
                })
              )}
            </button>

            <textarea
              ref={inputRef}
              value={typed}
              onChange={handleInputChange}
              className='absolute h-px w-px resize-none opacity-0'
              aria-label='Typing input'
              disabled={!content || status === 'finished'}
            />

            {status === 'idle' && content && (
              <p className='mt-4 text-sm font-semibold app-muted'>
                Click the passage and start typing. Controls lock once the timer
                begins.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
