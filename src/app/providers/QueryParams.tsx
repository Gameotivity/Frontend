import type { PropsWithChildren } from 'react'
import { QueryParamProvider } from 'use-query-params'
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6'

import qs from 'query-string'

const QueryParamsProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryParamProvider
      adapter={ReactRouter6Adapter}
      options={{
        searchStringToObject: qs.parse,
        objectToSearchString: qs.stringify,
      }}
    >
      {children}
    </QueryParamProvider>
  )
}

export default QueryParamsProvider
