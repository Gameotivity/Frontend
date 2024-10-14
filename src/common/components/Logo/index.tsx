import { Link } from 'react-router-dom'
import { Logo as LogoSvg } from '@/assets/svg/Logo'

interface Props {
  to: string
}

const Logo = ({ to }: Props) => {
  return (
    <Link to={to}>
      <div className="flex flex-row gap-2">
        <LogoSvg className="-mt-1 h-9" />
      </div>
    </Link>
  )
}

export default Logo
