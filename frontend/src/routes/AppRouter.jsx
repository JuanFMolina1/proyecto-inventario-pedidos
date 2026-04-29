import { Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/Dashboard'
import Clientes from '../pages/Clientes'
import Pedidos from '../pages/Pedidos'
import Articulos from '../pages/Articulos'
import Fabricas from '../pages/Fabricas'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="articulos" element={<Articulos />} />
        <Route path="fabricas" element={<Fabricas />} />
        <Route path="pedidos" element={<Pedidos />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter
