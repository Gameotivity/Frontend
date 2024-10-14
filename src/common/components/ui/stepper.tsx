import * as React from 'react'

import { cn } from '@/common/styleUtils'

type StepperContextValue = {
  activeIndex?: number
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

const useStepperContext = () => {
  const ctx = React.useContext(StepperContext)
  if (ctx === undefined) {
    throw new Error('StepperContext has not been set, value is undefined')
  }
  return ctx
}

const Stepper = React.forwardRef<
  HTMLOListElement,
  React.HTMLAttributes<HTMLOListElement> & StepperContextValue
>(({ className, ...props }, ref) => {
  const total = (React.Children.count(props.children) - 1) * 1.0
  const percentage = `${(((props.activeIndex || 0.0) / total) * 100).toFixed(0)}%`

  return (
    <StepperContext.Provider value={{ activeIndex: props.activeIndex || 0 }}>
      <ol
        ref={ref}
        style={{ '--percentage': percentage } as React.CSSProperties}
        className={cn(
          'relative border-s',
          '[border-image:linear-gradient(to_bottom,hsl(var(--strike))_var(--percentage),hsl(var(--secondary))_var(--percentage))_1_100%]',
          className,
        )}
        {...props}
      >
        {React.Children.map(props.children, (child, index) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                ...child.props,
                className: cn(
                  index < React.Children.count(props.children) - 1 && 'mb-6',
                  child.props.className,
                ),
              })
            : child,
        )}
      </ol>
    </StepperContext.Provider>
  )
})
Stepper.displayName = 'Stepper'

type StepperStepContextValue = {
  index: number
}

const StepperStepContext = React.createContext<StepperStepContextValue | undefined>(undefined)

const useStepperStepContext = () => {
  const ctx = React.useContext(StepperStepContext)
  if (ctx === undefined) {
    throw new Error('StepperStepContext has not been set, value is undefined')
  }
  return ctx
}

const StepperStep = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement> & StepperStepContextValue
>(({ className, ...props }, ref) => {
  return (
    <StepperStepContext.Provider value={{ index: props.index }}>
      <li id={`step-${props.index}`} ref={ref} className={cn('ms-6', className)} {...props} />
    </StepperStepContext.Provider>
  )
})
StepperStep.displayName = 'StepperStep'

const StepperStepContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { activeIndex } = useStepperContext()
    const { index } = useStepperStepContext()
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        <span className="absolute -start-1.5 mt-1 flex h-3 w-3 items-center justify-center rounded-full bg-background ring-8 ring-background dark:bg-background dark:ring-background">
          <span
            className={cn(
              'absolute flex h-3 w-3 items-center justify-center rounded-full ring-2',
              activeIndex &&
                index <= activeIndex &&
                'bg-blue-700 ring-blue-700 dark:bg-blue-700 dark:ring-blue-700',
              (!activeIndex || (activeIndex && index > activeIndex)) &&
                'bg-muted ring-secondary dark:bg-muted dark:ring-secondary',
              className,
            )}
          >
            {activeIndex !== undefined && index < activeIndex && (
              <svg
                className="h-6 w-6 text-white dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m5 12 4.7 4.5 9.3-9"
                />
              </svg>
            )}
          </span>
        </span>
        <p
          className={cn(
            activeIndex && index < activeIndex && 'text-sm text-muted-foreground',
            activeIndex && index === activeIndex && 'text-sm text-primary',
            (!activeIndex || (activeIndex && index > activeIndex)) && 'text-sm text-secondary',
            className,
          )}
        >
          {props.children}
        </p>
      </div>
    )
  },
)
StepperStepContent.displayName = 'StepperStepContent'

export { Stepper, StepperStep, StepperStepContent }
