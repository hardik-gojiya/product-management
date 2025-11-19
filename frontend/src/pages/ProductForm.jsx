import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

export default function ProductForm({ editMode }) {
  const { id } = useParams()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Other')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (editMode && id) {
      api.get(`/products/${id}`)
        .then(res => {
          const p = res.data.data
          setName(p.name)
          setDescription(p.description)
          setPrice(p.price)
          setCategory(p.category)
        })
        .catch(err => setError(err.response?.data?.message || 'Unable to load product'))
    }
  }, [editMode, id])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    // Client-side validation to avoid backend 400 errors
    const trimmedName = (name || '').trim()
    const trimmedDescription = (description || '').trim()

    if (!trimmedName || trimmedName.length < 2) {
      setError('Name is required (min 2 characters)')
      return
    }

    if (!trimmedDescription) {
      setError('Description is required')
      return
    }

    const parsedPrice = Number(price)
    if (Number.isNaN(parsedPrice)) {
      setError('Price must be a valid number')
      return
    }

    // Require price > 0 to satisfy backend presence check (backend treats 0 as missing)
    if (parsedPrice <= 0) {
      setError('Price must be greater than 0')
      return
    }

    if (!category) {
      setError('Category is required')
      return
    }

    try {
      const payload = { name: trimmedName, description: trimmedDescription, price: parsedPrice, category }
      if (editMode && id) {
        await api.put(`/products/${id}`, payload)
      } else {
        await api.post('/products', payload)
      }
      navigate('/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{editMode ? 'Edit' : 'New'} Product</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="w-full p-2 border rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
        <select className="w-full p-2 border rounded" value={category} onChange={e => setCategory(e.target.value)}>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Food</option>
          <option>Books</option>
          <option>Home</option>
          <option>Sports</option>
          <option>Other</option>
        </select>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
          <button type="button" onClick={() => navigate('/products')} className="px-3 py-1 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  )
}
