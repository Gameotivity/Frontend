import { cn } from '@/common/styleUtils'
import React from 'react'

export interface InfiniteMovingCardsProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'left' | 'right'
  speed?: 'fast' | 'normal' | 'slow'
  pauseOnHover?: boolean
}

const InfiniteMovingCards = React.forwardRef<HTMLDivElement, InfiniteMovingCardsProps>(
  ({ className, direction, speed, pauseOnHover, children, ...props }, ref) => {
    const animationDirection = direction === 'left' ? 'forwards' : 'reverse'
    const animationDuration = speed === 'fast' ? '20s' : speed === 'normal' ? '40s' : '80s'

    return (
      <div
        ref={ref}
        style={
          {
            '--animation-duration': animationDuration,
            '--animation-direction': animationDirection,
          } as React.CSSProperties
        }
        className={cn(
          'inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]',
          className,
        )}
        {...props}
      >
        <ul
          className={cn(
            'animate-infinite-scroll flex items-center justify-center',
            pauseOnHover && 'hover:[animation-play-state:paused]',
          )}
        >
          {children}
        </ul>
        <ul
          className={cn(
            'animate-infinite-scroll flex items-center justify-center',
            pauseOnHover && 'hover:[animation-play-state:paused]',
          )}
          aria-hidden="true"
        >
          {children}
        </ul>
      </div>
    )
  },
)

export { InfiniteMovingCards }
