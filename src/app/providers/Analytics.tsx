import { useEffect } from 'react'

import { init as initFullStory } from '@fullstory/browser'

const Analytics = () => {
  useEffect(() => {
    if (import.meta.env.PROD) initFullStory({ orgId: import.meta.env.VITE_FULLSTORY_ORG_ID })
  }, [])
  return <></>
}

export default Analytics
