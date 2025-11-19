import connectDB from '../../backend/config/db.js'
import User from '../../backend/models/User.js'
import jwt from 'jsonwebtoken'

// Helper to generate token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// Connect to DB once per invocation (Vercel may reuse instances)
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

    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' })
    }

    const user = await User.create({ name, email, password })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ success: false, message: error.message || 'Server error' })
  }
}
