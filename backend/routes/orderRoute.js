import express from 'express'
import { placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyRazorpay, createCashfreeOrder, verifyCashfreePayment, cashfreeDebug, cashfreeWebhook } from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';

const orderRouter = express.Router();

//admin features
orderRouter.post('/list',adminAuth, allOrders )
orderRouter.post('/status', adminAuth, updateStatus)

//payment features
orderRouter.post('/place',authUser, placeOrder )
orderRouter.post('/razorpay',authUser,  placeOrderRazorpay )

// cashfree payment features
orderRouter.post('/cashfree/create', authUser, createCashfreeOrder)
orderRouter.post('/cashfree/verify', authUser, verifyCashfreePayment)
orderRouter.get('/cashfree/debug', cashfreeDebug)
orderRouter.post('/cashfree/webhook', cashfreeWebhook)

//user feature
orderRouter.post('/userorders', authUser, userOrders)

//verify razrpay
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)


export default orderRouter;
