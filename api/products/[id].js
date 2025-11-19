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

  const { id } = req.query
  const product = await Product.findById(id)
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
  if (product.userId.toString() !== user._id.toString()) return res.status(403).json({ success: false, message: 'Not authorized' })

  if (req.method === 'GET') {
    return res.json({ success: true, message: 'Product retrieved', data: product })
  }

  if (req.method === 'PUT') {
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    return res.json({ success: true, message: 'Product updated', data: updated })
  }

  if (req.method === 'DELETE') {
    await Product.findByIdAndDelete(id)
    return res.json({ success: true, message: 'Product deleted', data: {} })
  }

  return res.status(405).json({ success: false, message: 'Method not allowed' })
}
