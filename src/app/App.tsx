import { Routes, Route } from 'react-router-dom'

import { APP_ROUTES } from '@/app/routes/app'
import Dashboard from '@/features/dashboard'

const App = () => {
  return (
    <Routes>
      <Route path={APP_ROUTES.index.path} element={<Dashboard />} />
    </Routes>
  )
}

export default App
