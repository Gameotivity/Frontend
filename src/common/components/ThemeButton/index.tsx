import { Moon, Sun } from 'lucide-react'

import { useTheme, Theme } from '@/app/providers/Theme'
import { Button } from '@/common/components/ui/button'

const ThemeButton = () => {
  const { rawTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(rawTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK)}
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </Button>
  )
}

export default ThemeButton
