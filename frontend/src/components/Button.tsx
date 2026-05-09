import React from 'react'

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  isFullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-cyan-600 text-white shadow-sm shadow-cyan-950/20 hover:bg-cyan-500 active:bg-cyan-700 disabled:bg-cyan-600/45 dark:bg-cyan-400 dark:text-slate-950 dark:hover:bg-cyan-300',
  secondary:
    'app-input hover:bg-[var(--surface-soft)] active:bg-[var(--surface-strong)] disabled:opacity-60',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700 disabled:bg-rose-600/45',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-500 active:bg-emerald-700 disabled:bg-emerald-600/45',
  warning:
    'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 disabled:bg-amber-500/45',
  ghost:
    'bg-transparent text-[var(--muted-strong)] hover:bg-[var(--surface-soft)] active:bg-[var(--surface-strong)] disabled:text-[var(--muted)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      icon,
      iconPosition = 'left',
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    const baseStyles =
      'inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:cursor-not-allowed'

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${isFullWidth ? 'w-full' : ''}
      ${className || ''}
    `
      .replace(/\s+/g, ' ')
      .trim()

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className='h-4 w-4 animate-spin'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
            >
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
              />
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className='flex-shrink-0'>{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === 'right' && (
              <span className='flex-shrink-0'>{icon}</span>
            )}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
