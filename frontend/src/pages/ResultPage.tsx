import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Clock3,
  Keyboard,
  LogIn,
  RefreshCw,
  Save,
  Target,
  Trophy,
} from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import { saveResult } from '../api/results'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import type { CompletedTestResult } from '../types/testResult'

type ResultLocationState = {
  result?: CompletedTestResult
}

const formatMode = (mode: string) =>
  mode.charAt(0).toUpperCase() + mode.slice(1)

export const ResultPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const locationState = location.state as ResultLocationState | null
  const initialResult = locationState?.result
  const [result, setResult] = useState(initialResult)
  const saveAttemptKey = useRef('')

  const persistResult = useCallback(async () => {
    if (!result || !isAuthenticated) return

    const saveKey = [
      result.textId ?? 'no-text',
      result.mode,
      result.durationSeconds,
      result.correctCharacters,
      result.totalKeyPresses,
      result.completedAt,
    ].join(':')

    if (saveAttemptKey.current === saveKey) return
    saveAttemptKey.current = saveKey

    setResult((current) =>
      current
        ? { ...current, saveStatus: 'saving', saveError: undefined }
        : current,
    )

    try {
      await saveResult({
        textId: result.textId,
        mode: result.mode,
        durationSeconds: result.durationSeconds,
        correctCharacters: result.correctCharacters,
        totalKeyPresses: result.totalKeyPresses,
      })
      setResult((current) =>
        current
          ? { ...current, saveStatus: 'saved', saveError: undefined }
          : current,
      )
    } catch (error) {
      saveAttemptKey.current = ''
      setResult((current) =>
        current
          ? {
              ...current,
              saveStatus: 'error',
              saveError: getApiErrorMessage(
                error,
                'Result could not be saved.',
              ),
            }
          : current,
      )
    }
  }, [isAuthenticated, result])

  useEffect(() => {
    if (result?.saveStatus === 'saving') {
      void persistResult()
    }
  }, [persistResult, result?.saveStatus])

  if (!result) {
    return <Navigate to='/test' replace />
  }

  const saveMessage = {
    guest: 'Login to save this result and build your history.',
    saving: 'Saving your result...',
    saved: 'Saved to your history.',
    error: result.saveError ?? 'Result could not be saved.',
  }[result.saveStatus]

  return (
    <main className='app-page py-10'>
      <div className='app-shell'>
        <section className='mx-auto max-w-5xl'>
          <div className='mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
            <div>
              <p className='mb-3 inline-flex items-center gap-2 rounded-md app-surface px-3 py-2 text-sm font-bold app-muted'>
                <Trophy size={17} />
                Test complete
              </p>
              <h1 className='text-4xl font-black app-text sm:text-5xl'>
                {result.wpm} WPM with {result.accuracy}% accuracy
              </h1>
              <p className='mt-4 max-w-2xl text-base leading-7 app-muted'>
                {result.textTitle} finished in {result.durationSeconds} seconds
                using {formatMode(result.mode)} mode.
              </p>
            </div>
            <Button
              type='button'
              onClick={() => navigate('/test')}
              icon={<RefreshCw size={17} />}
            >
              Go again
            </Button>
          </div>

          <div className='grid gap-4 md:grid-cols-4'>
            <div className='app-surface rounded-lg p-5'>
              <GaugeLabel icon={<Keyboard size={20} />} label='WPM' />
              <p className='mt-3 text-4xl font-black app-text'>{result.wpm}</p>
            </div>
            <div className='app-surface rounded-lg p-5'>
              <GaugeLabel icon={<Target size={20} />} label='Accuracy' />
              <p className='mt-3 text-4xl font-black app-text'>
                {result.accuracy}%
              </p>
            </div>
            <div className='app-surface rounded-lg p-5'>
              <GaugeLabel icon={<Clock3 size={20} />} label='Duration' />
              <p className='mt-3 text-4xl font-black app-text'>
                {result.durationSeconds}s
              </p>
            </div>
            <div className='app-surface rounded-lg p-5'>
              <GaugeLabel icon={<BarChart3 size={20} />} label='Progress' />
              <p className='mt-3 text-4xl font-black app-text'>
                {result.progress}%
              </p>
            </div>
          </div>

          <section className='mt-5 app-surface rounded-lg p-5'>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div>
                <h2 className='text-xl font-black app-text'>
                  Passage progress
                </h2>
                <p className='mt-1 text-sm font-semibold app-muted'>
                  {result.correctCharacters} correct,{' '}
                  {result.incorrectCharacters} incorrect,{' '}
                  {result.totalKeyPresses} total key presses.
                </p>
              </div>
              <div className='text-sm font-bold app-muted'>
                {result.wordCount} words
              </div>
            </div>
            <div className='mt-5 h-4 overflow-hidden rounded-full bg-[var(--surface-soft)]'>
              <div
                className='h-full rounded-full bg-cyan-600 dark:bg-cyan-300'
                style={{ width: `${result.progress}%` }}
              />
            </div>
          </section>

          <section className='mt-5 grid gap-5 lg:grid-cols-[1fr_320px]'>
            <div className='app-surface rounded-lg p-5'>
              <h2 className='text-xl font-black app-text'>What this means</h2>
              <p className='mt-3 leading-7 app-muted'>
                Your WPM is based on correct characters divided into standard
                five-character words. Accuracy compares correct characters with
                total key presses, so clean typing matters as much as raw speed.
              </p>
              <div className='mt-5 grid gap-3 sm:grid-cols-2'>
                <div className='rounded-md app-surface-soft p-4'>
                  <p className='text-sm font-bold app-muted'>Correct</p>
                  <p className='mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300'>
                    {result.correctCharacters}
                  </p>
                </div>
                <div className='rounded-md app-surface-soft p-4'>
                  <p className='text-sm font-bold app-muted'>Needs work</p>
                  <p className='mt-1 text-2xl font-black text-rose-700 dark:text-rose-300'>
                    {result.incorrectCharacters}
                  </p>
                </div>
              </div>
            </div>

            <aside className='app-surface rounded-lg p-5'>
              <h2 className='mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide app-muted'>
                <Save size={17} />
                Save status
              </h2>
              <p
                className={[
                  'rounded-md border px-3 py-2 text-sm font-semibold',
                  result.saveStatus === 'saved'
                    ? 'border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100'
                    : '',
                  result.saveStatus === 'error'
                    ? 'border-rose-300 bg-rose-100 text-rose-900 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-100'
                    : '',
                  result.saveStatus === 'guest' ||
                  result.saveStatus === 'saving'
                    ? 'border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100'
                    : '',
                ].join(' ')}
              >
                {saveMessage}
              </p>

              <div className='mt-4 grid gap-2'>
                {result.saveStatus === 'guest' && (
                  <Button
                    type='button'
                    onClick={() => navigate('/login')}
                    icon={<LogIn size={17} />}
                    isFullWidth
                  >
                    Login to save
                  </Button>
                )}

                {result.saveStatus === 'error' && isAuthenticated && (
                  <Button
                    type='button'
                    onClick={() => void persistResult()}
                    icon={<Save size={17} />}
                    isFullWidth
                  >
                    Try saving again
                  </Button>
                )}

                {isAuthenticated && (
                  <Button
                    type='button'
                    variant='secondary'
                    onClick={() => navigate('/history')}
                    icon={<BarChart3 size={17} />}
                    isFullWidth
                  >
                    View history
                  </Button>
                )}

                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => navigate('/test')}
                  icon={<RefreshCw size={17} />}
                  isFullWidth
                >
                  Go again
                </Button>
              </div>
            </aside>
          </section>

          <p className='mt-6 text-center text-sm font-semibold app-muted'>
            Want typing notes and product updates?{' '}
            <a
              href='https://mblog-frl0.onrender.com'
              target='_blank'
              rel='noreferrer'
              className='font-black text-cyan-700 underline dark:text-cyan-300'
            >
              Visit the blog
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  )
}

const GaugeLabel = ({ icon, label }: { icon: ReactNode; label: string }) => (
  <div className='flex items-center gap-2 text-sm font-black uppercase tracking-wide app-muted'>
    <span className='grid h-9 w-9 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200'>
      {icon}
    </span>
    {label}
  </div>
)
