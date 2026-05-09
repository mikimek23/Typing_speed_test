import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  Keyboard,
  Moon,
  Type,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'

const sections = [
  {
    icon: <Keyboard size={20} />,
    title: 'Two ways to measure skill',
    body: 'Timed mode is ideal for quick benchmarking, while passage mode measures how well a user maintains accuracy from the first character to the final word.',
  },
  {
    icon: <Type size={20} />,
    title: 'Accessibility-minded reading',
    body: 'The typing area offers Comfort, Large, and Extra large sizes so the test remains usable on phones, laptops, and larger displays.',
  },
  {
    icon: <BarChart3 size={20} />,
    title: 'Result pages with context',
    body: 'After a test, users see speed, accuracy, duration, progress, character counts, and save status on a dedicated page built for review.',
  },
  {
    icon: <FileText size={20} />,
    title: 'Personal practice material',
    body: 'Accounts can store private passages, making the tool useful for interview prep, course material, documentation, or article drafts.',
  },
]

export const AboutPage = () => {
  return (
    <main className='app-page py-10'>
      <div className='app-shell'>
        <section className='grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center'>
          <div className='motion-rise'>
            <p className='mb-4 inline-flex items-center gap-2 rounded-md app-surface px-3 py-2 text-sm font-black app-muted'>
              <CheckCircle2 size={17} />
              About TypingPro
            </p>
            <h1 className='max-w-3xl text-5xl font-black leading-tight app-text'>
              A typing test designed for practice, review, and steady
              improvement.
            </h1>
            <p className='mt-6 max-w-2xl text-lg leading-8 app-muted'>
              TypingPro keeps the main workflow simple: choose a passage, type
              in a readable workspace, then review a result that explains what
              happened. It uses the current backend for accounts, passages,
              saved results, and private text libraries.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link to='/test'>
                <Button size='lg' icon={<Keyboard size={19} />}>
                  Start test
                </Button>
              </Link>
              <Link to='/blog'>
                <Button
                  size='lg'
                  variant='secondary'
                  icon={<BookOpen size={19} />}
                >
                  Read blog
                </Button>
              </Link>
            </div>
          </div>

          <aside className='app-surface rounded-lg p-6 motion-float'>
            <h2 className='text-2xl font-black app-text'>Product priorities</h2>
            <div className='mt-5 space-y-4'>
              <Priority
                icon={<Moon size={18} />}
                text='Consistent light and dark mode contrast.'
              />
              <Priority
                icon={<Type size={18} />}
                text='Large passage text that can be adjusted.'
              />
              <Priority
                icon={<BarChart3 size={18} />}
                text='Compact mobile metrics that keep the passage visible.'
              />
              <Priority
                icon={<BookOpen size={18} />}
                text='Inline access to the connected blog app.'
              />
            </div>
          </aside>
        </section>

        <section className='mt-8 grid gap-4 md:grid-cols-2'>
          {sections.map((section) => (
            <article
              key={section.title}
              className='app-surface rounded-lg p-5 motion-rise-delayed transition hover:-translate-y-1'
            >
              <span className='grid h-11 w-11 place-items-center rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-200'>
                {section.icon}
              </span>
              <h2 className='mt-5 text-xl font-black app-text'>
                {section.title}
              </h2>
              <p className='mt-3 leading-7 app-muted'>{section.body}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

const Priority = ({ icon, text }: { icon: ReactNode; text: string }) => (
  <div className='flex items-center gap-3 rounded-md app-surface-soft p-3'>
    <span className='text-cyan-700 dark:text-cyan-200'>{icon}</span>
    <p className='text-sm font-bold app-text'>{text}</p>
  </div>
)
