import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit3, FilePlus2, Keyboard, Trash2 } from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import {
  createMyText,
  deleteMyText,
  getMyTexts,
  updateMyText,
  type Difficulty,
  type TextPayload,
  type TypingText,
} from '../api/texts'
import { Button } from '../components/Button'

const difficulties: Difficulty[] = ['easy', 'medium', 'hard']

const emptyForm: TextPayload = {
  title: '',
  content: '',
  difficulty: 'medium',
}

const formatDifficulty = (difficulty: string) =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()

export const TextLibraryPage = () => {
  const navigate = useNavigate()
  const [texts, setTexts] = useState<TypingText[]>([])
  const [form, setForm] = useState<TextPayload>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTexts = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const payload = await getMyTexts()
      setTexts(payload.texts)
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes('not found')) {
        setTexts([])
      } else {
        setError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadTexts()
  }, [loadTexts])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        await updateMyText(editingId, form)
        setSuccess('Text updated.')
      } else {
        await createMyText(form)
        setSuccess('Text created.')
      }

      resetForm()
      await loadTexts()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (text: TypingText) => {
    setEditingId(text.id)
    setForm({
      title: text.title,
      content: text.content,
      difficulty: text.difficulty.toLowerCase() as Difficulty,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    setError('')
    setSuccess('')

    try {
      await deleteMyText(id)
      setSuccess('Text deleted.')
      await loadTexts()
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError, 'Could not delete text.'))
    }
  }

  const handlePractice = (text: TypingText) => {
    navigate('/test', { state: { practiceText: text } })
  }

  return (
    <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6'>
      <section className='mb-8'>
        <p className='mb-3 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'>
          <FilePlus2 size={17} />
          Private practice material
        </p>
        <h1 className='text-4xl font-black text-slate-950 dark:text-white'>
          Custom texts
        </h1>
        <p className='mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300'>
          Create backend-backed passages, keep them private, and launch a test
          from your own library.
        </p>
      </section>

      <section className='grid gap-5 lg:grid-cols-[420px_1fr]'>
        <form
          onSubmit={handleSubmit}
          className='rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900'
        >
          <h2 className='text-xl font-black text-slate-950 dark:text-white'>
            {editingId ? 'Edit text' : 'Add text'}
          </h2>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
            Content must be at least 20 characters.
          </p>

          {error && (
            <div className='mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-100'>
              {error}
            </div>
          )}

          {success && (
            <div className='mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-100'>
              {success}
            </div>
          )}

          <label className='mt-5 block'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
              Title
            </span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              required
              minLength={3}
              maxLength={100}
              className='mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
              placeholder='Technical interview warmup'
            />
          </label>

          <label className='mt-4 block'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
              Difficulty
            </span>
            <select
              value={form.difficulty}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  difficulty: event.target.value as Difficulty,
                }))
              }
              className='mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {formatDifficulty(difficulty)}
                </option>
              ))}
            </select>
          </label>

          <label className='mt-4 block'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
              Content
            </span>
            <textarea
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
              required
              minLength={20}
              maxLength={50000}
              rows={9}
              className='mt-2 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-3 text-sm font-medium leading-6 text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
              placeholder='Paste the paragraph you want to practice...'
            />
          </label>

          <div className='mt-5 flex flex-wrap gap-2'>
            <Button
              type='submit'
              isLoading={isSubmitting}
              icon={<FilePlus2 size={17} />}
            >
              {editingId ? 'Save changes' : 'Create text'}
            </Button>
            {editingId && (
              <Button type='button' variant='secondary' onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <section className='rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
          <div className='border-b border-slate-200 px-5 py-4 dark:border-slate-800'>
            <h2 className='text-xl font-black text-slate-950 dark:text-white'>
              Your library
            </h2>
          </div>

          {isLoading ? (
            <p className='p-5 text-sm font-semibold text-slate-500 dark:text-slate-400'>
              Loading texts...
            </p>
          ) : texts.length === 0 ? (
            <div className='p-8 text-center'>
              <p className='text-lg font-black text-slate-950 dark:text-white'>
                No custom texts yet
              </p>
              <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                Add one from the form and it will be available for practice.
              </p>
            </div>
          ) : (
            <div className='divide-y divide-slate-100 dark:divide-slate-800'>
              {texts.map((text) => (
                <article key={text.id} className='p-5'>
                  <div className='flex flex-col justify-between gap-4 md:flex-row md:items-start'>
                    <div>
                      <h3 className='text-lg font-black text-slate-950 dark:text-white'>
                        {text.title}
                      </h3>
                      <p className='mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400'>
                        {formatDifficulty(text.difficulty)} - {text.wordCount}{' '}
                        words
                      </p>
                      <p className='mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300'>
                        {text.content}
                      </p>
                    </div>

                    <div className='flex shrink-0 flex-wrap gap-2'>
                      <Button
                        type='button'
                        size='sm'
                        onClick={() => handlePractice(text)}
                        icon={<Keyboard size={16} />}
                      >
                        Practice
                      </Button>
                      <Button
                        type='button'
                        variant='secondary'
                        size='sm'
                        onClick={() => handleEdit(text)}
                        icon={<Edit3 size={16} />}
                      >
                        Edit
                      </Button>
                      <button
                        type='button'
                        onClick={() => void handleDelete(text.id)}
                        className='inline-grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-200'
                        aria-label='Delete text'
                        title='Delete text'
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
