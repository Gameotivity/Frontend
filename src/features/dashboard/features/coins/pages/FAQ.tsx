import { Typography, SEO } from '@/common/components'
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from '@/common/components/ui/accordion'
import { useTranslation } from 'react-i18next'

const FAQ = () => {
  const { t } = useTranslation()
  return (
    <>
      <SEO title={t('seo:faq.title')} />
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="w-11/12 space-y-4 sm:w-11/12 md:w-11/12 lg:w-4/5 xl:w-3/5">
          <Typography variant="h3">{t('faq:title')}</Typography>
          <Accordion type="multiple">
            {['what', 'how', 'ownership', 'tokenomics', 'optionalBuy', 'fees'].map((value) => (
              <AccordionItem value={value} className="p-2">
                <AccordionHeader>
                  <Typography variant="h4" className="text-left">
                    {t(`faq:${value}.title`)}
                  </Typography>
                </AccordionHeader>
                <AccordionContent>
                  <Typography variant="mutedText" className="whitespace-pre-wrap font-medium">
                    {t(`faq:${value}.content`)}
                  </Typography>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  )
}

export default FAQ
