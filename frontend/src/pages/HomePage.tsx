import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Keyboard,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

const features = [
  {
    icon: <Keyboard size={20} />,
    title: 'Practice that stays readable',
    body: 'Large, adjustable passage text and clear character feedback help users focus on rhythm instead of fighting the interface.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Results you can act on',
    body: 'Every completed test explains speed, accuracy, progress, duration, and mistakes so improvement feels concrete.',
  },
  {
    icon: <FileText size={20} />,
    title: 'Your own practice library',
    body: 'Authenticated users can save private passages for interviews, lessons, articles, or any material they type often.',
  },
]

export const HomePage = () => {
  return (
    <main className='app-page'>
      <section className='app-shell grid min-h-[calc(100vh-73px)] items-center gap-10 py-10 lg:grid-cols-[1fr_520px]'>
        <div className='motion-rise'>
          <p className='mb-5 inline-flex items-center gap-2 rounded-md app-surface px-3 py-2 text-sm font-black app-muted'>
            <Sparkles size={17} />
            Focused typing assessment
          </p>
          <h1 className='max-w-3xl text-5xl font-black leading-tight app-text sm:text-6xl'>
            Build typing speed with feedback that is easy to understand.
          </h1>
          <p className='mt-6 max-w-2xl text-lg leading-8 app-muted'>
            TypingPro is a clean practice workspace for measuring WPM, accuracy,
            and completion progress. It supports guest practice, saved accounts,
            custom passages, and a result flow that makes the next session
            clearer.
          </p>
          <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
            <Link to='/test'>
              <Button size='lg' icon={<Keyboard size={19} />}>
                Start test
              </Button>
            </Link>
            <Link to='/about'>
              <Button
                size='lg'
                variant='secondary'
                icon={<BookOpen size={19} />}
              >
                About app
              </Button>
            </Link>
            <Link to='/blog'>
              <Button size='lg' variant='ghost' icon={<BookOpen size={19} />}>
                Blog
              </Button>
            </Link>
          </div>

          <div className='mt-10 grid gap-3 sm:grid-cols-3'>
            <Stat value='60s' label='timed mode' />
            <Stat value='100%' label='progress view' />
            <Stat value='3' label='text sizes' />
          </div>
        </div>

        <div className='app-surface rounded-lg p-5 motion-float'>
          <div className='mb-5 flex items-center justify-between gap-3 border-b app-border pb-4'>
            <div>
              <p className='text-sm font-black uppercase tracking-wide app-muted'>
                Live test preview
              </p>
              <h2 className='mt-1 text-xl font-black app-text'>
                Practice preview
              </h2>
            </div>
            <span className='rounded-md bg-cyan-600 px-3 py-1 text-sm font-black text-white dark:bg-cyan-300 dark:text-slate-950'>
              72 WPM
            </span>
          </div>
          <p className='rounded-md app-surface-soft p-5 text-[2rem] font-semibold leading-[1.65] app-muted'>
            <span className='text-emerald-700 dark:text-emerald-300'>
              Consistent typing
            </span>{' '}
            <span className='bg-cyan-300 text-slate-950'>i</span>mproves when
            feedback is visible, readable, and immediate.
          </p>
          <div className='mt-5 grid gap-3 sm:grid-cols-3'>
            <PreviewMetric
              icon={<Target size={18} />}
              label='Accuracy'
              value='96%'
            />
            <PreviewMetric
              icon={<CheckCircle2 size={18} />}
              label='Progress'
              value='68%'
            />
            <PreviewMetric
              icon={<ShieldCheck size={18} />}
              label='Saved'
              value='Yes'
            />
          </div>
        </div>
      </section>

      <section className='app-shell pb-14'>
        <div className='grid gap-4 md:grid-cols-3'>
          {features.map((feature) => (
            <article
              key={feature.title}
              className='app-surface rounded-lg p-5 motion-rise-delayed transition hover:-translate-y-1'
            >
              <span className='grid h-11 w-11 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200'>
                {feature.icon}
              </span>
              <h2 className='mt-5 text-xl font-black app-text'>
                {feature.title}
              </h2>
              <p className='mt-3 leading-7 app-muted'>{feature.body}</p>
            </article>
          ))}
        </div>

        <div className='mt-5 grid gap-4 lg:grid-cols-[1fr_360px]'>
          <section className='app-surface rounded-lg p-6'>
            <h2 className='text-2xl font-black app-text'>
              Built to fit your backend
            </h2>
            <p className='mt-3 leading-7 app-muted'>
              The frontend works with the existing auth, texts, and results
              endpoints. Guests can start immediately, while signed-in users can
              save results, review history, and manage private practice text.
            </p>
          </section>
          <Link
            to='/blog'
            className='app-surface group rounded-lg p-6 transition hover:-translate-y-0.5'
          >
            <div className='flex items-center justify-between gap-3'>
              <h2 className='text-2xl font-black app-text'>Read the blog</h2>
              <ArrowRight
                className='transition group-hover:translate-x-1'
                size={22}
              />
            </div>
            <p className='mt-3 leading-7 app-muted'>
              Load the connected blog inside the app for posts, release notes,
              and longer writing about the project.
            </p>
          </Link>
        </div>
      </section>
    </main>
  )
}

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className='app-surface rounded-lg p-4'>
    <p className='text-2xl font-black app-text'>{value}</p>
    <p className='mt-1 text-sm font-bold app-muted'>{label}</p>
  </div>
)

const PreviewMetric = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) => (
  <div className='rounded-md app-surface-soft p-3'>
    <div className='flex items-center gap-2 text-sm font-bold app-muted'>
      {icon}
      {label}
    </div>
    <p className='mt-1 text-xl font-black app-text'>{value}</p>
  </div>
)
