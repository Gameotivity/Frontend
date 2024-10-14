import { TelegramIcon } from '@/assets/svg/TelegramIcon'
import { TwitterIcon } from '@/assets/svg/TwitterIcon'
import Typography from '../Typography'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="bottom-0 z-40 w-full border-t bg-background">
      <div className="container flex h-fit flex-col items-center justify-center gap-6 py-2 sm:flex-row">
        <div className="flex flex-row items-center gap-2">
          <button onClick={() => navigate({ pathname: APP_ROUTES.tos.to })}>
            <Typography variant="mutedText">Terms of Service</Typography>
          </button>
        </div>
        <div className="flex flex-row items-center gap-2">
          <a href="https://t.me/+OuYA3ZHYfxw4ZGI0" target="_blank" rel="noreferrer">
            <TelegramIcon className="h-6 w-6" />
          </a>
          <a href="https://x.com/FomoFactoryWTF" target="_blank" rel="noreferrer">
            <TwitterIcon className="h-6 w-6" />
          </a>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Typography variant="mutedText">© 2024 FomoFactory</Typography>
        </div>
      </div>
    </footer>
  )
}

export default Footer
