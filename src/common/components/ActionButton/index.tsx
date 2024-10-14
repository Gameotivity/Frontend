import type { ReactNode } from 'react'
import type { ButtonProps } from '../ui/button'
import { Button } from '../ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

const ActionButton = ({
  isPending,
  icon,
  label,
  onClick,
  variant,
}: {
  isPending: boolean
  icon: ReactNode
  label: ReactNode
  onClick: VoidFunction
  variant?: ButtonProps['variant']
}) => (
  <Tooltip delayDuration={300}>
    <TooltipTrigger asChild>
      <Button variant={variant} size="icon" disabled={isPending} onClick={onClick}>
        {icon}
        <span className="sr-only">{label}</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

export default ActionButton
