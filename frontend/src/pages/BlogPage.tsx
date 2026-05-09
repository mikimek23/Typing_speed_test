import { ExternalLink, Newspaper } from 'lucide-react'
import { Button } from '../components/Button'

const blogUrl = 'https://mblog-frl0.onrender.com'

export const BlogPage = () => {
  return (
    <main className='app-page py-4 sm:py-8'>
      <div className='app-shell'>
        <section className='mb-4 flex flex-col justify-between gap-3 sm:mb-6 lg:flex-row lg:items-end'>
          <div className='motion-rise'>
            <p className='mb-3 inline-flex items-center gap-2 rounded-md app-surface px-3 py-2 text-sm font-black app-muted'>
              <Newspaper size={17} />
              Blog
            </p>
            <h1 className='text-3xl font-black app-text sm:text-5xl'>
              Notes, updates, and writing from the blog.
            </h1>
            <p className='mt-3 max-w-2xl text-sm leading-6 app-muted sm:text-base sm:leading-7'>
              The blog is loaded inside the app so readers can move between
              practice, results, and articles without losing context.
            </p>
          </div>
          <a href={blogUrl} target='_blank' rel='noreferrer'>
            <Button variant='secondary' icon={<ExternalLink size={17} />}>
              Open original
            </Button>
          </a>
        </section>

        <section className='app-surface overflow-hidden rounded-lg motion-rise-delayed'>
          <div className='border-b app-border px-4 py-3 text-sm font-semibold app-muted'>
            {blogUrl}
          </div>
          <iframe
            src={blogUrl}
            title='Mento blog'
            className='h-[calc(100vh-220px)] min-h-[560px] w-full bg-white'
          />
        </section>

        <p className='mt-4 text-sm font-semibold app-muted'>
          If the blog host blocks inline embedding, use Open original to view it
          in a separate tab.
        </p>
      </div>
    </main>
  )
}
