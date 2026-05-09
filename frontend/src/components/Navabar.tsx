import { useEffect, useState, type ReactNode } from 'react'
import {
  Activity,
  BarChart3,
  BookOpen,
  FileText,
  Home,
  Keyboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserPlus,
  X,
} from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { userLogOut } from '../api/auth'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Button } from './Button'

type NavItem = {
  to: string
  label: string
  icon: ReactNode
  authOnly?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: <Home size={17} /> },
  { to: '/test', label: 'Test', icon: <Activity size={17} /> },
  { to: '/about', label: 'About', icon: <BookOpen size={17} /> },
  { to: '/blog', label: 'Blog', icon: <BookOpen size={17} /> },
  {
    to: '/history',
    label: 'History',
    icon: <BarChart3 size={17} />,
    authOnly: true,
  },
  {
    to: '/texts',
    label: 'Texts',
    icon: <FileText size={17} />,
    authOnly: true,
  },
]

export const Navabar = () => {
  const { isAuthenticated, user } = useAuth()
  const { resolvedTheme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await userLogOut()
    setIsMenuOpen(false)
    navigate('/')
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition',
      isActive
        ? 'bg-[var(--foreground)] text-[var(--background)]'
        : 'text-[var(--muted-strong)] hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]',
    ].join(' ')

  const mobileNavClass = ({ isActive }: { isActive: boolean }) =>
    [
      'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition',
      isActive
        ? 'bg-[var(--foreground)] text-[var(--background)]'
        : 'text-[var(--muted-strong)] hover:bg-[var(--surface-soft)]',
    ].join(' ')

  const visibleItems = navItems.filter(
    (item) => !item.authOnly || isAuthenticated,
  )

  return (
    <header className='sticky top-0 z-40 border-b app-border bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] backdrop-blur-xl'>
      <nav className='app-shell flex h-[73px] items-center justify-between gap-4'>
        <Link
          to='/'
          className='inline-flex min-w-0 items-center gap-2 text-[var(--foreground)]'
          aria-label='TypingPro home'
        >
          <span className='grid h-10 w-10 shrink-0 place-items-center rounded-md bg-cyan-600 text-white shadow-sm dark:bg-cyan-400 dark:text-slate-950'>
            <Keyboard size={21} />
          </span>
          <span className='min-w-0'>
            <span className='block truncate text-base font-black leading-tight'>
              TypingPro
            </span>
            <span className='block truncate text-xs font-semibold app-muted'>
              speed test
            </span>
          </span>
        </Link>

        <div className='hidden items-center gap-1 lg:flex'>
          {visibleItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className='hidden items-center gap-2 lg:flex'>
          <button
            type='button'
            onClick={toggleTheme}
            className='grid h-10 w-10 place-items-center rounded-md text-[var(--muted-strong)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
            aria-label='Toggle theme'
            title='Toggle theme'
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAuthenticated ? (
            <>
              <div className='max-w-44 truncate text-sm font-semibold app-muted'>
                {user?.name}
              </div>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                onClick={handleLogout}
                icon={<LogOut size={16} />}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => navigate('/login')}
                icon={<LogIn size={16} />}
              >
                Login
              </Button>
              <Button
                type='button'
                size='sm'
                onClick={() => navigate('/register')}
                icon={<UserPlus size={16} />}
              >
                Register
              </Button>
            </>
          )}
        </div>

        <div className='flex items-center gap-2 lg:hidden'>
          <button
            type='button'
            onClick={toggleTheme}
            className='grid h-10 w-10 place-items-center rounded-md text-[var(--muted-strong)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--foreground)]'
            aria-label='Toggle theme'
            title='Toggle theme'
          >
            {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type='button'
            onClick={() => setIsMenuOpen((open) => !open)}
            className='grid h-10 w-10 place-items-center rounded-md app-input transition hover:bg-[var(--surface-soft)]'
            aria-label='Toggle menu'
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className='border-t app-border lg:hidden'>
          <div className='app-shell py-3'>
            <div className='app-surface rounded-lg p-3'>
              <div className='grid gap-1'>
                {visibleItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={mobileNavClass}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <div className='mt-3 border-t app-border pt-3'>
                {isAuthenticated ? (
                  <div className='grid gap-3'>
                    <div className='truncate px-3 text-sm font-semibold app-muted'>
                      Signed in as {user?.name}
                    </div>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={handleLogout}
                      icon={<LogOut size={16} />}
                      isFullWidth
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className='grid grid-cols-2 gap-2'>
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => navigate('/login')}
                      icon={<LogIn size={16} />}
                    >
                      Login
                    </Button>
                    <Button
                      type='button'
                      onClick={() => navigate('/register')}
                      icon={<UserPlus size={16} />}
                    >
                      Register
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
