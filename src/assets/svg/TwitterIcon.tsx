import React from 'react'

export const TwitterIcon = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className }) => {
    return (
      <svg
        className={className}
        viewBox="0 0 512 512"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
        image-rendering="optimizeQuality"
        fill-rule="evenodd"
        clip-rule="evenodd"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0z" />
        <path
          fill="#fff"
          fill-rule="nonzero"
          d="M 346.648 113.564 L 394.982 113.564 L 289.381 234.235 L 413.616 398.436 L 316.338 398.436 L 240.152 298.845 L 152.976 398.436 L 104.609 398.436 L 217.559 269.367 L 98.383 113.564 L 198.124 113.564 L 266.993 204.59 L 346.648 113.564 Z M 329.682 369.51 L 356.467 369.51 L 183.572 140.971 L 154.832 140.971 L 329.682 369.51 Z"
        />
      </svg>
    )
  },
)
