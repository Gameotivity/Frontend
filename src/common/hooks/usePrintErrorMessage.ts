import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

export const useShowError = () => {
  const { t } = useTranslation()

  return useCallback(
    (error: unknown, id?: string) => {
      if (import.meta.env.DEV) {
        console.error(error)
      }
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
      ) {
        toast.error(error.message, { id })
      } else if (typeof error === 'string') {
        toast.error(error, { id })
      } else {
        toast.error(t('global:unexpectedError'), { id })
      }
    },
    [t],
  )
}
