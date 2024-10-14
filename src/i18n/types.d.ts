import 'i18next'

import type { LANGUAGES_CONFIG, SUPPORTED_LANGUAGES } from '.'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof LANGUAGES_CONFIG)[(typeof SUPPORTED_LANGUAGES)[0]]['resources']
    defaultNS: false
    returnNull: false
  }
}
