import React, { useContext, useState } from 'react'
import { Title } from '../Components/Title'
import { CartTotal } from '../Components/CartTotal'
import { ShopContext } from '../Context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import api from "../api/axios";

const PlaceOrder = () => {

    const [method, setMethod] = useState('cod');
    const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setFormData(data => ({ ...data, [name]: value }))
    }


    const initCashfreeCheckout = async (paymentSessionId) => {
        const mode = import.meta.env.VITE_CASHFREE_MODE || 'sandbox';
        const cashfree = window.Cashfree?.({ mode });
        if (!cashfree) {
            toast.error('Cashfree SDK not loaded');
            return;
        }
        try {
            await cashfree.checkout({
                paymentSessionId,
                redirectTarget: '_self'
            });
        } catch (err) {
            console.error(err);
            toast.error('Payment cancelled or failed');
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {

            let orderItems = []
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item] > 0) {
                        const itemInfo = structuredClone(products.find(product => product._id === items))
                        if (itemInfo) {
                            itemInfo.size = item
                            itemInfo.quantity = cartItems[items][item]
                            orderItems.push(itemInfo)

                        }

                    }
                }
            }

            let orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + delivery_fee
            }

            switch (method) {
                case 'cod':
                    const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })
                    if (response.data.success) {
                        setCartItems({});
                        toast.success('Your order has been placed! Thank you for shopping with us. 🎉')
                        navigate('/orders')
                    } else {
                        toast.error("You need to be logged in to place an order.")
                    }
                    break;


                

                case 'cashfree':
                    // map formData to email/phone expected by backend
                    const cfResponse = await axios.post(backendUrl + '/api/order/cashfree/create', { ...orderData, email: formData.email, phone: formData.phone }, { headers: { token } })
                    if (cfResponse.data.success) {
                        const sessionId = cfResponse.data.cashfree?.payment_session_id;
                        if (!sessionId) {
                            toast.error('Missing payment session id');
                            return;
                        }
                        await initCashfreeCheckout(sessionId);
                        // After redirection/return, verify by polling API (simple approach)
                        try {
                            const orderId = cfResponse.data.order?._id;
                            if (orderId) {
                                const verifyRes = await axios.post(backendUrl + '/api/order/cashfree/verify', { order_id: orderId }, { headers: { token } })
                                if (verifyRes.data.success) {
                                    setCartItems({});
                                    toast.success('Your order has been placed! 🎉')
                                    navigate('/orders')
                                } else {
                                    toast.error('Payment not completed');
                                }
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    } else {
                        toast.error('Failed to initiate Cashfree order')
                    }
                    break;

                default:
                    break;
            }

        } catch (error) {
            console.error('Order submission error:', error)
            toast.error("Sorry, we couldn't place your order. Please try again later.")
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14  border-t'>
            {/*------ Left side -------- */}
            <div className='flex flex-col gap-4 w-full sm: max-w-[480px]'>

                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'DELIVERY'} text2={'INFORMATION'} />
                </div>

                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='First Name' required />
                    <input onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Last Name' />
                </div>

                <input onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='email' placeholder='Email Address' />
                <input onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Street' required />

                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='City' required />
                    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='State' required />
                </div>

                <div className='flex gap-3'>
                    <input onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='number' placeholder='Zip Code' required />
                    <input onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='text' placeholder='Country' required />
                </div>

                <input onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type='tel' placeholder='Contact Number' required />
            </div>

            {/*------------------ Right side---------------------------- */}
            <div className='mt-8'>
                <div className='mt-8 min-w-80'>
                    <CartTotal />
                </div>

                <div className='mt-12'>
                    <Title text1={'PAYMENT'} text2={'OPTIONS'} />
                    {/*----- Payment options------- */}
                    <div className='flex gap-3 flex-col lg:flex-row'>
                        <div onClick={() => setMethod('cashfree')} className='flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full text-gray-400 ${method === 'cashfree' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASHFREE</p>
                        </div>
                        <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border border-gray-200 p-2 px-3 cursor-pointer'>
                            <p className={`min-w-3.5 h-3.5 border rounded-full text-gray-400 ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
                            <p className='text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className='w-full text-end mt-8'>
                        <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>Place Order</button>
                    </div>

                </div>

            </div>
        </form>
    )
}

export default PlaceOrder