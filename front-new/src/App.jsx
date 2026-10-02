import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Avendre from './pages/Avendre'
import Alouer from './pages/Alouer'
import Prestation from './pages/Prestation'
import Apropos from './pages/Apropos'
import PropertyDetails from './pages/PropertyDetails'
import Recherche from './pages/Recherche'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Properties from './pages/admin/Properties'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/Avendre" element={<Avendre />} />
      <Route path="/Alouer" element={<Alouer />} />
      <Route path="/Prestation" element={<Prestation />} />
      <Route path="/Apropos" element={<Apropos />} />
      <Route path="/Recherche" element={<Recherche />} />
      <Route path="/property/:id" element={<PropertyDetails />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="properties" element={<Properties />} />
      </Route>
    </Routes>
  )
}

export default App

