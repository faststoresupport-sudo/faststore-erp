import { ReactNode } from 'react'
import { clsx } from 'clsx'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  full?: boolean
}

export function Button({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  full = false
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    full && 'w-full'
  ]

  const variants = {
    primary: [
      'bg-blue-500 text-white shadow-sm',
      'hover:bg-blue-600 focus:ring-blue-500',
      'active:bg-blue-700'
    ],
    secondary: [
      'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
      'hover:bg-gray-200 dark:hover:bg-gray-600',
      'focus:ring-gray-500'
    ],
    danger: [
      'bg-red-500 text-white shadow-sm',
      'hover:bg-red-600 focus:ring-red-500',
      'active:bg-red-700'
    ],
    success: [
      'bg-green-500 text-white shadow-sm',
      'hover:bg-green-600 focus:ring-green-500',
      'active:bg-green-700'
    ],
    warning: [
      'bg-orange-500 text-white shadow-sm',
      'hover:bg-orange-600 focus:ring-orange-500',
      'active:bg-orange-700'
    ]
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const classes = clsx(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  )

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}