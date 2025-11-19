import connectDB from '../../../backend/config/db.js'
import Product from '../../../backend/models/Product.js'
import User from '../../../backend/models/User.js'
import jwt from 'jsonwebtoken'

let connected = false
const ensureDB = async () => {
  if (!connected) {
    await connectDB()
    connected = true
  }
}

const getUserFromToken = async (req) => {
  const auth = req.headers.authorization || ''
  if (!auth.startsWith('Bearer ')) return null
  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    return user
  } catch (err) {
    return null
  }
}

export default async function handler(req, res) {
  await ensureDB()
  const user = await getUserFromToken(req)
  if (!user) return res.status(401).json({ success: false, message: 'Not authorized' })

  if (req.method === 'GET') {
    const products = await Product.find({ userId: user._id }).sort({ createdAt: -1 })
    return res.json({ success: true, message: 'Products retrieved', count: products.length, data: products })
  }

  if (req.method === 'POST') {
    const { name, description, price, category } = req.body
    if (!name || !description || !price || !category) return res.status(400).json({ success: false, message: 'Please provide all required fields' })
    const product = await Product.create({ userId: user._id, name, description, price, category })
    return res.status(201).json({ success: true, message: 'Product created', data: product })
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' })
}
