import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import adminRouter from './routes/adminRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000

// Database Connections
connectDB()
connectCloudinary()

// -------------------------
// Allowed Origins
// -------------------------
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  `
  http://localhost:5173,
  http://localhost:5174,
  https://forever-frontend-neon-seven.vercel.app,
  https://forever-frontend-lyart.vercel.app,
  https://forever-admin.vercel.app
  `
)
.split(',')
.map(origin => origin.trim())
.filter(Boolean)

// -------------------------
// Middlewares
// -------------------------

// Cashfree webhook raw body
app.use('/api/order/cashfree/webhook', bodyParser.raw({ type: '*/*' }))

// JSON body parser
app.use(express.json())

// CORS
app.use(cors({
  origin: function (origin, callback) {

    // Allow Postman / Mobile Apps / No Origin Requests
    if (!origin) return callback(null, true)

    // Allow listed domains
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    // Allow all vercel frontend URLs (optional)
    if (origin.includes('.vercel.app')) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

// -------------------------
// API Routes
// -------------------------
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)

// -------------------------
// Test Route
// -------------------------
app.get('/', (req, res) => {
  res.send('API WORKING')
})

// -------------------------
// Start Server
// -------------------------
app.listen(port, () => {
  console.log(`Server Started on port: ${port}`)
})