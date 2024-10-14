import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/common/styleUtils'

const buttonVariants = cva(
  'text inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary font-bold text-primary-foreground shadow-lg transition duration-300 ease-in-out hover:scale-1025 active:scale-95 active:after:scale-[1.0]',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        transparent: 'h-auto p-0 hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 rounded-full px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-full px-8 text-lg',
        xl: 'h-20 rounded-full px-8 text-2xl xl:h-20 xl:px-10 xl:text-3xl',
        icon: 'h-6 w-6',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, loading, children, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, className }), className)}
        ref={ref}
        {...props}
      >
        <>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {children}
        </>
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
