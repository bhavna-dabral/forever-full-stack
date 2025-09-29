import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from 'razorpay';
import cashfreeHttp, { cashfreeAuthHeaders, cashfreeConfig, resolvedClientId, resolvedClientSecret } from '../config/cashfree.js';
import crypto from 'crypto';

const currency = 'inr';
const deliveryCharge = 10;

// placing order using Razorpay method
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


// Placing order using COD method
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Placing order using razor-pay method
const placeOrderRazorpay = async (req, res) => {
    try{
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: newOrder._id.toString(),
        }

        razorpayInstance.orders.create(options, (error, order) => {
            if(error){
                console.log(error);
                return res.json({ success: false, message: error.message })
            }
            res.json({ success: true, order })
        })
        
    }catch(error){
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const verifyRazorpay = async(req, res) => {
    try{
        const {userId, razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === 'paid'){
            await orderModel.findByIdAndUpdate(orderInfo.receipt, {payment: true})
            await orderModel.findByIdAndUpdate(userId,{cartDats:{}})
            res.json({ success: true, message: 'Payment successful' })
        }else{
            res.json({ success: false, message: 'Payment failed' })
        }
    }catch(error){
        console.log(error)
        res.json({success:false, message:error.message})

    }
}

//all orders data for admin panel
const allOrders = async (req, res) => {
    try {

        const orders = await orderModel.find({})
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// User order data for frontend
const userOrders = async (req, res) => {
    try {

        const { userId } = req.body;
        const orders = await orderModel.find({ userId })
        res.json({ success: true, orders })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//update order status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Status Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export { verifyRazorpay, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus }

// Cashfree: Create Order and return payment_session_id
export const createCashfreeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: 'Cashfree',
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:5173';
        const backendBase = process.env.BACKEND_PUBLIC_URL || `${req.protocol}://${req.get('host')}`;

        const requestBody = {
            order_id: newOrder._id.toString(),
            order_amount: amount,
            order_currency: 'INR',
            customer_details: {
                customer_id: userId,
                customer_email: req.body?.email || 'test@example.com',
                customer_phone: req.body?.phone || '9999999999'
            },
            order_meta: {
                return_url: `${frontendUrl}/orders`,
                notify_url: `${backendBase}/api/order/cashfree/webhook`
            }
        };

        const { data } = await cashfreeHttp.post('/orders', requestBody, {
            headers: cashfreeAuthHeaders()
        });

        // data contains payment_session_id
        return res.json({ success: true, order: newOrder, cashfree: data });
    } catch (error) {
        console.log(error?.response?.data || error.message);
        return res.status(500).json({ success: false, message: error?.response?.data || error.message });
    }
}

// Cashfree: Verify Order Status by order_id
export const verifyCashfreePayment = async (req, res) => {
    try {
        const { order_id } = req.body; // expects Mongo order _id
        const { data } = await cashfreeHttp.get(`/orders/${order_id}`, {
            headers: cashfreeAuthHeaders()
        });

        if (data?.order_status === 'PAID') {
            const updated = await orderModel.findByIdAndUpdate(order_id, { payment: true }, { new: true });
            // clear user's cart after successful payment
            if (updated?.userId) {
                await userModel.findByIdAndUpdate(updated.userId, { cartData: {} });
            }
            return res.json({ success: true, status: data?.order_status });
        }
        return res.json({ success: false, status: data?.order_status });
    } catch (error) {
        console.log(error?.response?.data || error.message);
        return res.status(500).json({ success: false, message: error?.response?.data || error.message });
    }
}

// TEMP: Cashfree debug endpoint (does not expose secrets)
export const cashfreeDebug = async (req, res) => {
    try {
        const envName = cashfreeConfig.environment;
        const hasId = !!resolvedClientId.value;
        const hasSecret = !!resolvedClientSecret.value;
        return res.json({
            success: true,
            env: envName,
            clientId_present: hasId,
            clientSecret_present: hasSecret,
            clientId_var_name: resolvedClientId.name || null,
            clientSecret_var_name: resolvedClientSecret.name || null
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message })
    }
}

// Cashfree Webhook Handler
export const cashfreeWebhook = async (req, res) => {
    try {
        const signatureHeader = req.headers['x-webhook-signature'] || req.headers['x-webhook-signature'.toLowerCase()];
        const secret = process.env.CASHFREE_WEBHOOK_SECRET;
        const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
        let payload;
        try {
            payload = JSON.parse(rawBody.toString('utf8'));
        } catch (e) {
            // Sometimes Cashfree sends already-parsed JSON via proxies
            payload = typeof req.body === 'object' ? req.body : {};
        }

        // Try to extract order_id and payment status from multiple possible shapes
        const orderId = payload?.data?.order?.order_id || payload?.data?.order_id || payload?.order?.order_id || payload?.order_id;
        const orderStatus = payload?.data?.order_status || payload?.order_status;
        const paymentStatus = payload?.data?.payment?.payment_status || payload?.payment?.payment_status;
        const eventType = payload?.type || payload?.event || '';

        let isPaid = (orderStatus && String(orderStatus).toUpperCase() === 'PAID') || (paymentStatus && String(paymentStatus).toUpperCase() === 'SUCCESS') || /PAYMENT\.(SUCCESS|CAPTURED)/i.test(eventType);

        // If secret and signature exist, verify HMAC; if missing, fall back to API fetch
        if (secret && signatureHeader) {
            try {
                const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('base64');
                const valid = crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(computed));
                if (!valid) {
                    return res.status(400).json({ success: false, message: 'Invalid signature' })
                }
            } catch (e) {
                console.log('Signature verify error', e?.message);
                return res.status(400).json({ success: false, message: 'Invalid signature' })
            }
        } else if (orderId && !isPaid) {
            // No signature path: confirm with Cashfree API using server credentials
            try {
                const { data } = await cashfreeHttp.get(`/orders/${orderId}`, { headers: cashfreeAuthHeaders() });
                if (data?.order_status === 'PAID') {
                    isPaid = true;
                }
            } catch (e) {
                console.log('Fallback verify error', e?.response?.data || e?.message);
            }
        }

        if (orderId && isPaid) {
            const updated = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
            if (updated?.userId) {
                await userModel.findByIdAndUpdate(updated.userId, { cartData: {} });
            }
        }

        // Always 200 to acknowledge
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        // Still 200 to prevent retries storm; log error for investigation
        return res.status(200).json({ success: true });
    }
}
