import type { ReactNode } from 'react'
import { Typography } from '..'

interface SeparatedDataRowsProps {
  rows: [ReactNode | string, ReactNode | string][]
}

const SeparatedDataRows = ({ rows }: SeparatedDataRowsProps) => {
  return (
    <div className="flex flex-wrap">
      {rows.map(([label, value], i) => {
        return (
          <div key={`data-row-${i}`} className="mb-2 flex w-full items-center justify-between">
            {typeof label === 'string' ? (
              <Typography className="text-xl" variant={'mutedText'}>
                {label}
              </Typography>
            ) : (
              label
            )}
            {typeof value === 'string' ? (
              <Typography className="ml-2 text-xl capitalize">{value}</Typography>
            ) : (
              value
            )}
          </div>
        )
      })}
    </div>
  )
}

export default SeparatedDataRows
