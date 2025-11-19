import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/products')
      setProducts(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products')
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const remove = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(p => p.filter(x => x._id !== id))
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Your Products</h1>
        <Link to="/products/new" className="bg-blue-600 text-white px-3 py-1 rounded">New Product</Link>
      </div>

      {loading ? <div>Loading...</div> : null}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.category} • ${p.price}</p>
              </div>
              <div className="space-x-2">
                <Link to={`/products/${p._id}/edit`} className="text-blue-600 text-sm">Edit</Link>
                <button onClick={()=>remove(p._id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
            <p className="mt-2 text-sm">{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
