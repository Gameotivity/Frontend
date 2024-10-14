import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './global.css'

import Root from '@/app/Root'

const rootEl = document.querySelector('#root')

if (!rootEl) {
  throw new Error('No #root element')
}

createRoot(rootEl).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
