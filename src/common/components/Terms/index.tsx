import { useTranslation } from 'react-i18next'

import { Typography } from '@/common/components'

const Terms = () => {
  const { t } = useTranslation()

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex h-full w-11/12 grow flex-col items-center justify-center gap-x-6 gap-y-6 sm:w-11/12 md:w-11/12 lg:w-4/5 xl:w-3/5">
        <Typography variant="h3">{t('terms:message.title')}</Typography>
        <Typography variant="mutedText" className="whitespace-pre-wrap">
          {t('terms:message.text')}
        </Typography>
      </div>
    </div>
  )
}

export default Terms
