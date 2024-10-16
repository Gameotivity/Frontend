import { useTranslation } from 'react-i18next'
import { Typography } from '@/common/components'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/common/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/common/components/ui/avatar'

import { LANGUAGES_CONFIG, useLanguage } from '@/i18n'
import { useTheme } from '@/app/providers/Theme'

interface Props {
  email: string
}

const UserDropdown = ({ email }: Props) => {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <Avatar className="size-8">
            <AvatarFallback>{email.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <Typography variant="smallText">{email}</Typography>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LanguageDropdown />
          <ThemeDropdown />
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => {}}>{t('dashboard:header.signOut')}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const LanguageDropdown = () => {
  const { t } = useTranslation()

  const [{ code }, setLanguage] = useLanguage()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{t('dashboard:header.language')}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={code} onValueChange={setLanguage}>
            {Object.values(LANGUAGES_CONFIG).map(({ code, name }) => (
              <DropdownMenuRadioItem value={code} key={code}>
                {name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

const ThemeDropdown = () => {
  const { t } = useTranslation()

  const { rawTheme, setTheme, themes } = useTheme()

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{t('dashboard:header.theme')}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={rawTheme} onValueChange={setTheme}>
            {themes.map(({ value, label }) => (
              <DropdownMenuRadioItem value={value} key={value}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}

export default UserDropdown
