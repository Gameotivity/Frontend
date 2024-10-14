import { configMocks, type MockViewport } from 'jsdom-testing-mocks'
import { act } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

import '@/i18n'

import { setDesktopResolution } from './utils'

configMocks({ act })

setDesktopResolution()

let viewport: MockViewport
beforeEach(() => {
  viewport = setDesktopResolution()
})
afterEach(() => {
  viewport.cleanup()
})
