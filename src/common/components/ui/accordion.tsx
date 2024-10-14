import { cn } from '@/common/styleUtils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import React from 'react'

const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    className={cn('w-full space-y-4 transition duration-300 ease-in-out', className)}
    {...props}
  />
))
Accordion.displayName = AccordionPrimitive.Root.displayName

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(
        'w-full rounded-lg border-2 transition duration-300 ease-in-out focus:outline-none',
        className,
      )}
      {...props}
    />
  )
})
AccordionItem.displayName = AccordionPrimitive.Item.displayName

const AccordionHeader = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Header>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Header ref={ref} className={cn('w-full', className)} {...props}>
    <AccordionPrimitive.Trigger
      className={cn(
        'group',
        'radix-state-open:rounded-md radix-state-closed:rounded-md',
        'focus:outline-none',
        'inline-flex w-full items-center justify-between px-4 py-2 text-left',
      )}
    >
      <span className="text font-bold">{props.children}</span>
      <ChevronDownIcon
        className={cn(
          'ml-2 h-5 w-5 shrink-0 text-gray-700 ease-in-out dark:text-gray-400',
          'group-radix-state-open:rotate-180 group-radix-state-open:duration-300',
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionHeader.displayName = AccordionPrimitive.Header.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn('w-full px-4 pb-3 pt-1 transition duration-300 ease-in-out', className)}
    {...props}
  >
    <div className="space-y-3">{props.children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionHeader, AccordionItem, AccordionContent }
