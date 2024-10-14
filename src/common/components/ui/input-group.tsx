import * as React from 'react'

import { cn } from '@/common/styleUtils'

const InputGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="relative flex flex-row rounded-md transition duration-300 ease-in-out has-[:focus]:shadow-lg has-[:focus]:shadow-primary has-[:focus-visible]:outline-none has-[:focus]:outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring "
      >
        {React.Children.map(props.children, (child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                ...child.props,
                className: cn(
                  index === 0 && 'rounded-l-md',
                  index === React.Children.count(props.children) - 1 && 'rounded-r-md',
                  child.props.className,
                ),
              })
            : child,
        )}
      </div>
    )
  },
)
InputGroup.displayName = 'InputGroup'

const InputGroupInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
InputGroupInput.displayName = 'InputGroupInput'

const InputGroupText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex min-w-fit items-center border border-s-0 border-input bg-muted px-4 text-sm text-muted-foreground dark:border-input dark:bg-muted dark:text-muted-foreground',
          className,
        )}
        {...props}
      />
    )
  },
)
InputGroupInput.displayName = 'InputGroupInput'

export { InputGroup, InputGroupInput, InputGroupText }
