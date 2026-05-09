import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react'
import { getApiErrorMessage } from '../api/axios'
import { userLogin, userRegister } from '../api/auth'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'

type AuthPageProps = {
  mode: 'login' | 'register'
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate()
  const { isAuthenticated, isInitialized } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isRegister = mode === 'register'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await userRegister({ name, email, password })
      }

      await userLogin({ email, password })
      navigate('/')
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isInitialized && isAuthenticated) {
    return <Navigate to='/' replace />
  }

  return (
    <main className='mx-auto grid min-h-[calc(100vh-89px)] max-w-6xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_420px]'>
      <section className='max-w-2xl'>
        <div className='mb-6 inline-flex items-center gap-2 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 dark:border-cyan-900/70 dark:bg-cyan-950/50 dark:text-cyan-200'>
          <ShieldCheck size={17} />
          Save progress across every session
        </div>
        <h1 className='text-4xl font-black tracking-normal text-slate-950 dark:text-white sm:text-5xl'>
          Build a typing record you can actually improve.
        </h1>
        <p className='mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300'>
          Guests can practice instantly. Accounts add saved results, history,
          and private passages that fit the backend already in this project.
        </p>
      </section>

      <section className='rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        <div className='mb-6'>
          <h2 className='text-2xl font-black text-slate-950 dark:text-white'>
            {isRegister ? 'Create account' : 'Welcome back'}
          </h2>
          <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
            {isRegister
              ? 'Register, then start saving your best tests.'
              : 'Log in to save results and manage custom texts.'}
          </p>
        </div>

        {error && (
          <div className='mb-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-200'>
            {error}
          </div>
        )}

        <form className='space-y-4' onSubmit={handleSubmit}>
          {isRegister && (
            <label className='block'>
              <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
                Name
              </span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                minLength={3}
                className='mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
                placeholder='Jane Typist'
              />
            </label>
          )}

          <label className='block'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
              Email
            </span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              type='email'
              className='mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
              placeholder='you@example.com'
            />
          </label>

          <label className='block'>
            <span className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
              Password
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              type='password'
              minLength={8}
              className='mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white'
              placeholder='At least 8 characters'
            />
            {isRegister && (
              <span className='mt-2 block text-xs font-medium text-slate-500 dark:text-slate-400'>
                Include uppercase, lowercase, number, and one of @$!%*?&.
              </span>
            )}
          </label>

          <Button
            type='submit'
            isFullWidth
            isLoading={isSubmitting}
            icon={isRegister ? <UserPlus size={17} /> : <LogIn size={17} />}
          >
            {isRegister ? 'Create account' : 'Login'}
          </Button>
        </form>

        <p className='mt-5 text-center text-sm text-slate-500 dark:text-slate-400'>
          {isRegister ? 'Already have an account?' : 'New here?'}{' '}
          <Link
            to={isRegister ? '/login' : '/register'}
            className='font-bold text-cyan-700 hover:text-cyan-600 dark:text-cyan-300'
          >
            {isRegister ? 'Login' : 'Create one'}
          </Link>
        </p>
      </section>
    </main>
  )
}
