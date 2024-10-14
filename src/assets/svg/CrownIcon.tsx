import React from 'react'

export const CrownIcon = React.forwardRef<SVGElement, React.HTMLAttributes<SVGElement>>(
  ({ className }) => {
    return (
      <svg
        className={className}
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        preserveAspectRatio="xMinYMin slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.8306 3.443C12.6449 3.16613 12.3334 3 12.0001 3C11.6667 3 11.3553 3.16613 11.1696 3.443L7.38953 9.07917L2.74781 3.85213C2.44865 3.51525 1.96117 3.42002 1.55723 3.61953C1.15329 3.81904 0.932635 4.26404 1.01833 4.70634L3.70454 18.5706C3.97784 19.9812 5.21293 21 6.64977 21H17.3504C18.7872 21 20.0223 19.9812 20.2956 18.5706L22.9818 4.70634C23.0675 4.26404 22.8469 3.81904 22.4429 3.61953C22.039 3.42002 21.5515 3.51525 21.2523 3.85213L16.6106 9.07917L12.8306 3.443Z" />
      </svg>
    )
  },
)
