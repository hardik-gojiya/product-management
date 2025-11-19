import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import Navbar from './components/Navbar'

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/products"
            element={<RequireAuth><Products /></RequireAuth>}
          />
          <Route
            path="/products/new"
            element={<RequireAuth><ProductForm /></RequireAuth>}
          />
          <Route
            path="/products/:id/edit"
            element={<RequireAuth><ProductForm editMode /></RequireAuth>}
          />
        </Routes>
      </div>
    </div>
  )
}
