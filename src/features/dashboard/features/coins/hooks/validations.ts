import { useMemo } from 'react'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const sizeInKB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / 1024
  return +result.toFixed(decimalsNum)
}

export const useNewCoinValidation = () => {
  const { t } = useTranslation()

  return useMemo(
    () =>
      z.object({
        name: z.string().min(1, {
          message: t('global:validations.name'),
        }),
        symbol: z.string().min(1, {
          message: t('global:validations.symbol'),
        }),
        description: z.string().min(10, {
          message: t('global:validations.description', { minLength: 10 }),
        }),
        totalSupply: z.coerce
          .number({ invalid_type_error: t('global:validations.required') })
          .min(1, {
            message: t('global:validations.totalSupply', { min: 1 }),
          }),
        avatar: z
          .instanceof(FileList, { message: t('global:validations.avatar.invalid') })
          .refine((fileList) => fileList.length > 0, {
            message: t('global:validations.avatar.invalid'),
          })
          .refine((fileList) => sizeInKB(fileList[0]!.size) <= 1000, {
            message: t('global:validations.avatar.size', { maxSize: 1000 }),
          }),
        twitter: z
          .string()
          .regex(new RegExp('^@[A-Za-z0-9_]{1,15}$'), t('global:validations.twitter'))
          .optional(),
        telegram: z
          .string()
          .regex(new RegExp('^@[A-Za-z0-9_]{5,}$'), t('global:validations.telegram'))
          .optional(),
        website: z.string().url(t('global:validations.website')).optional(),
        firstBuy: z.coerce
          .number({ invalid_type_error: t('global:validations.required') })
          .optional(),
      }),
    [t],
  )
}

export type NewCoinFields = z.infer<ReturnType<typeof useNewCoinValidation>>
