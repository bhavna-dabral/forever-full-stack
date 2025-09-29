import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import adminRouter from './routes/adminRoute.js';

//App Config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//Middlewares
// Use raw body for webhook verification on Cashfree route only
app.use('/api/order/cashfree/webhook', bodyParser.raw({ type: '*/*' }))
app.use(express.json())

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173,http://localhost:5174,https://forever-frontend-lyart.vercel.app").split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)

app.get('/', (req, res) =>{
    res.send("API WORKING")
})

app.listen(port, () => console.log('Server Started on port :' + port))
