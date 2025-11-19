import connectDB from '../../backend/config/db.js'
import User from '../../backend/models/User.js'
import jwt from 'jsonwebtoken'

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

let connected = false
const ensureDB = async () => {
  if (!connected) {
    await connectDB()
    connected = true
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    await ensureDB()
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (user && (await user.matchPassword(password))) {
      return res.json({ success: true, message: 'Login successful', data: { _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) } })
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}
