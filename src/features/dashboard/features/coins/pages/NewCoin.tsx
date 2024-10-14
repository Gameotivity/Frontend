import { Form, Typography } from '@/common/components'
import { zodResolver } from '@hookform/resolvers/zod'

import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { NewCoinFields, useNewCoinValidation } from '../hooks/validations'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormExtraLabel,
  FormMessage,
} from '@/common/components/ui/form'
import { Input } from '@/common/components/ui/input'
import { useCallback, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from '@/common/components/ui/accordion'
import { Textarea } from '@/common/components/ui/textarea'
import { InputGroup, InputGroupInput, InputGroupText } from '@/common/components/ui/input-group'
import { Button } from '@/common/components/ui/button'
import { Card, CardHeader } from '@/common/components/ui/card'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useShowError } from '@/common/hooks/usePrintErrorMessage'
import { EthIcon } from '@/assets/svg/EthIcon'
import { useSetTokenMetadata } from '@/client/mutations/tokenMetadata'
import { useCreateToken, useEstimateCreateToken } from '@/client/mutations/token'
import { useTokenAddress } from '@/client/queries/token'
import { useEthUsdAmount } from '@/client/queries/eth'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes'
import SEO from '@/common/components/SEO'
import { useAccount } from 'wagmi'
import { useIsSupportedChain } from '@/app/providers/Wallet'

const NewCoin = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const showError = useShowError()

  const account = useAccount()
  const { openConnectModal } = useConnectModal()
  const isSupportedChain = useIsSupportedChain()

  const { data: ethPrice } = useEthUsdAmount(1)

  const form = useForm<NewCoinFields>({
    resolver: zodResolver(useNewCoinValidation()),
  })

  const salt = useMemo(() => new Date().getTime(), [])

  const { mutate: setTokenMetadata, isPending: isSettingTokenMetadata } = useSetTokenMetadata({
    onError: () => showError(t('coin:new.error', { name: name })),
  })
  const { mutate: createToken, isPending: isCreatingToken } = useCreateToken({
    onError: () => showError(t('coin:new.error', { name: name })),
    onSuccess: (address) => {
      navigate({
        pathname: APP_ROUTES.coinDetails.to(address),
      })
    },
  })

  const name = form.watch('name')
  const symbol = form.watch('symbol')
  const totalSupply = form.watch('totalSupply')
  const firstBuy = form.watch('firstBuy')

  const { data: gasEstimate } = useEstimateCreateToken({
    name,
    symbol,
    totalSupply,
    salt,
    initialBuy: firstBuy,
  })
  const { data: tokenAddress } = useTokenAddress(name, symbol, totalSupply, salt)

  const [previewImage, setPreviewImage] = useState<string>('')

  const handleAvatarChange = (fileList: FileList) => {
    if (fileList.length === 1) {
      setPreviewImage(URL.createObjectURL(fileList[0]!))
    }
  }

  const onSubmit = useCallback(
    async (values: NewCoinFields) => {
      if (!tokenAddress) {
        showError(t('coin:new.error', { name: name }))
        return
      }

      setTokenMetadata(
        {
          address: tokenAddress,
          description: values.description,
          avatar: values.avatar[0]!,
          twitter: values.twitter,
          telegram: values.telegram,
          website: values.website,
        },
        {
          onSuccess: () => {
            createToken({
              name: values.name,
              symbol: values.symbol,
              totalSupply: values.totalSupply,
              salt: salt,
              initialBuy: values.firstBuy,
            })
          },
        },
      )
    },
    [tokenAddress, salt], // eslint-disable-line react-hooks/exhaustive-deps
  )

  return (
    <>
      <SEO
        title={t('seo:new.title')}
        subtitle={t('seo:new.subtitle')}
        description={t('seo:new.description')}
        frame={`coins/create`}
      />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <aside className="w-11/12 space-y-4 sm:w-11/12 md:w-9/12 lg:w-3/5 xl:w-2/5">
          <Typography variant="h3">{t('coin:new.title')}</Typography>

          <Form form={form} onSubmit={onSubmit} id="new-coin-form">
            {{
              formFields: (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('coin:metadata.name.label')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t('coin:metadata.name.placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('coin:metadata.symbol.label')}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t('coin:metadata.symbol.placeholder')}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('coin:metadata.description.label')}</FormLabel>
                        <FormExtraLabel>{t('coin:metadata.description.extra')}</FormExtraLabel>
                        <FormControl>
                          <Textarea
                            placeholder={t('coin:metadata.description.placeholder')}
                            maxLength={140}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalSupply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('coin:metadata.totalSupply.label')}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={t('coin:metadata.totalSupply.placeholder')}
                            step={1}
                            min={1}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>{t('coin:metadata.image.label')}</FormLabel>
                        <FormExtraLabel>{t('coin:metadata.image.extra')}</FormExtraLabel>
                        <FormControl>
                          <>
                            <Input
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              onChange={(event) => {
                                if (event?.target?.files) {
                                  handleAvatarChange(event?.target?.files)
                                }
                                onChange(event?.target?.files ?? '')
                              }}
                              className="pl-0"
                              {...field}
                            />
                            {previewImage && (
                              <div className="flex flex-col items-center">
                                <img
                                  className="aspect-square h-32 w-32 rounded-lg object-cover shadow-lg shadow-primary"
                                  src={previewImage}
                                  alt={t('coin:metadata.image.preview')}
                                />
                              </div>
                            )}
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Accordion type="multiple">
                    <AccordionItem value="socials">
                      <AccordionHeader>
                        {t('coin:new.socials.title')}
                        <span className="ml-4 text-muted-foreground">
                          {t('coin:new.socials.extra')}
                        </span>
                      </AccordionHeader>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="twitter"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('coin:socials.twitter.label')}</FormLabel>
                              <FormExtraLabel>{t('global:optional')}</FormExtraLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={t('coin:socials.twitter.placeholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="telegram"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('coin:socials.telegram.label')}</FormLabel>
                              <FormExtraLabel>{t('global:optional')}</FormExtraLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={t('coin:socials.telegram.placeholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('coin:socials.website.label')}</FormLabel>
                              <FormExtraLabel>{t('global:optional')}</FormExtraLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={t('coin:socials.website.placeholder')}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="trading">
                      <AccordionHeader>
                        {t('coin:new.trading.title')}
                        <span className="ml-4 text-muted-foreground">
                          {t('coin:new.trading.extra')}
                        </span>
                      </AccordionHeader>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="firstBuy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('coin:trading.firstBuy.label')}</FormLabel>
                              <FormExtraLabel>{t('coin:trading.firstBuy.extra')}</FormExtraLabel>
                              <FormControl>
                                <InputGroup>
                                  <InputGroupText>
                                    <EthIcon className="h-5 w-5" />
                                  </InputGroupText>
                                  <InputGroupInput type="number" min={0} step={0.0001} {...field} />
                                  <InputGroupText>ETH</InputGroupText>
                                </InputGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </>
              ),
              footer: (
                <div className="space-y-4">
                  {account.address && (
                    <Button
                      form="new-coin-form"
                      type="submit"
                      loading={isSettingTokenMetadata || isCreatingToken}
                      disabled={isSettingTokenMetadata || isCreatingToken || !isSupportedChain}
                      block
                    >
                      {isSettingTokenMetadata || isCreatingToken
                        ? t('coin:new.minting', { name: name })
                        : t('coin:new.submit')}
                    </Button>
                  )}
                  {!account.address && (
                    <Button type="button" onClick={openConnectModal} block>
                      {t('wallet:connect')}
                    </Button>
                  )}
                  <Card>
                    <CardHeader className="flex flex-row items-center space-x-1 space-y-0">
                      <Typography variant="regularText">
                        {t('coin:new.cost', { cost: (gasEstimate || 0).toFixed(4) })}
                      </Typography>
                      <Typography variant="regularText" className="text-muted-foreground">
                        {ethPrice && `($${((gasEstimate || 0) * ethPrice).toFixed(2)})`}
                      </Typography>
                    </CardHeader>
                  </Card>
                </div>
              ),
            }}
          </Form>
        </aside>
      </div>
    </>
  )
}

export default NewCoin
