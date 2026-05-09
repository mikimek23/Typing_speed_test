import { useCallback, useEffect, useMemo, useState } from 'react'
import { BarChart3, Clock3, Trash2, Trophy } from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import {
  deleteResult,
  getResults,
  type TypingMode,
  type TypingResult,
} from '../api/results'
import { Button } from '../components/Button'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const displayMode = (mode: string) => mode.toLowerCase()

export const HistoryPage = () => {
  const [results, setResults] = useState<TypingResult[]>([])
  const [mode, setMode] = useState<TypingMode | 'all'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadResults = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const payload = await getResults({
        page,
        limit: 10,
        mode: mode === 'all' ? undefined : mode,
      })
      setResults(payload.data)
      setTotalPages(Math.max(payload.pagination.totalPage, 1))
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes('not found')) {
        setResults([])
        setTotalPages(1)
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [mode, page])

  useEffect(() => {
    void loadResults()
  }, [loadResults])

  const summary = useMemo(() => {
    const bestWpm = results.reduce(
      (best, result) => Math.max(best, result.wpm),
      0,
    )
    const averageAccuracy = results.length
      ? Math.round(
          results.reduce((sum, result) => sum + result.accuracy, 0) /
            results.length,
        )
      : 0

    return { bestWpm, averageAccuracy }
  }, [results])

  const handleDelete = async (id: string) => {
    try {
      await deleteResult(id)
      await loadResults()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'Could not delete result.'))
    }
  }

  return (
    <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      <section className='mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end'>
        <div>
          <p className='mb-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
            <BarChart3 size={17} />
            Saved results
          </p>
          <h1 className='text-4xl font-black text-slate-950 dark:text-white'>
            Typing history
          </h1>
          <p className='mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300'>
            Review backend-saved tests, compare modes, and remove old runs.
          </p>
        </div>

        <select
          value={mode}
          onChange={(event) => {
            setMode(event.target.value as TypingMode | 'all')
            setPage(1)
          }}
          className='h-11 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-950 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
        >
          <option value='all'>All modes</option>
          <option value='timed'>Timed</option>
          <option value='passage'>Passage</option>
        </select>
      </section>

      <section className='mb-5 grid gap-4 md:grid-cols-3'>
        <div className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3'>
            <span className='grid h-10 w-10 place-items-center rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950/45 dark:text-amber-200'>
              <Trophy size={20} />
            </span>
            <div>
              <p className='text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                Best WPM
              </p>
              <p className='mt-1 text-2xl font-black text-slate-950 dark:text-white'>
                {summary.bestWpm}
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3'>
            <span className='grid h-10 w-10 place-items-center rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/45 dark:text-emerald-200'>
              <Clock3 size={20} />
            </span>
            <div>
              <p className='text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                Average accuracy
              </p>
              <p className='mt-1 text-2xl font-black text-slate-950 dark:text-white'>
                {summary.averageAccuracy}%
              </p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='flex items-center gap-3'>
            <span className='grid h-10 w-10 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/45 dark:text-cyan-200'>
              <BarChart3 size={20} />
            </span>
            <div>
              <p className='text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400'>
                Loaded tests
              </p>
              <p className='mt-1 text-2xl font-black text-slate-950 dark:text-white'>
                {results.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        {error && (
          <div className='border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-100'>
            {error}
          </div>
        )}

        {isLoading ? (
          <p className='p-6 text-sm font-semibold text-slate-500 dark:text-slate-400'>
            Loading history...
          </p>
        ) : results.length === 0 ? (
          <div className='p-8 text-center'>
            <p className='text-lg font-black text-slate-950 dark:text-white'>
              No saved tests yet
            </p>
            <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
              Complete a test while logged in and it will appear here.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[720px] text-left text-sm'>
              <thead className='border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400'>
                <tr>
                  <th className='px-4 py-3'>Date</th>
                  <th className='px-4 py-3'>Mode</th>
                  <th className='px-4 py-3'>WPM</th>
                  <th className='px-4 py-3'>Accuracy</th>
                  <th className='px-4 py-3'>Characters</th>
                  <th className='px-4 py-3'>Duration</th>
                  <th className='px-4 py-3 text-right'>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.id}
                    className='border-b border-slate-100 last:border-0 dark:border-slate-800'
                  >
                    <td className='px-4 py-4 font-semibold text-slate-700 dark:text-slate-200'>
                      {formatDate(result.completedAt)}
                    </td>
                    <td className='px-4 py-4 capitalize text-slate-600 dark:text-slate-300'>
                      {displayMode(result.mode)}
                    </td>
                    <td className='px-4 py-4 text-lg font-black text-slate-950 dark:text-white'>
                      {result.wpm}
                    </td>
                    <td className='px-4 py-4 text-slate-600 dark:text-slate-300'>
                      {result.accuracy}%
                    </td>
                    <td className='px-4 py-4 text-slate-600 dark:text-slate-300'>
                      {result.correctCharacters}/{result.incorrectCharacters}
                    </td>
                    <td className='px-4 py-4 text-slate-600 dark:text-slate-300'>
                      {result.durationSeconds ?? 0}s
                    </td>
                    <td className='px-4 py-4 text-right'>
                      <button
                        type='button'
                        onClick={() => void handleDelete(result.id)}
                        className='inline-grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-200'
                        aria-label='Delete result'
                        title='Delete result'
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className='flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800'>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Previous
          </Button>
          <span className='text-sm font-semibold text-slate-500 dark:text-slate-400'>
            Page {page} of {totalPages}
          </span>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            disabled={page >= totalPages}
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages))
            }
          >
            Next
          </Button>
        </div>
      </section>
    </main>
  )
}
