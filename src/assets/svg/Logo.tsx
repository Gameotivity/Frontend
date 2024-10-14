import React from 'react'

export const Logo = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className }) => {
    return (
      <svg className={className} viewBox="0 0 300 50" xmlns="http://www.w3.org/2000/svg">
        <text
          x="10"
          y="40"
          fontFamily="Arial, sans-serif"
          fontSize="40"
          fontWeight="bold"
          fill="#b19cd9"
        >
          DOGDEFI.FUN
        </text>
      </svg>
    )
  },
)

Logo.displayName = 'Logo'
