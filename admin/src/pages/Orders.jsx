import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

export const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token)
      return null;


    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        console.log('Orders fetched:', response.data.orders)
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status',
        { orderId, status: newStatus },
        { headers: { token } }
      )
      if (response.data.success) {
        toast.success('Order status updated successfully')
        await fetchAllOrders() // Refresh the orders list
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])
  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Order Page</h3>
      <div>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border border-gray-300 p-5 md;p-8 my-3 text-xs sm:text-sm text-gray-700">
              <img src={assets.parcel_icon} alt='' className="w-12" />
              <div>
                <div>
                  {order.items.map((item, index) => (
                    <p key={index} className="py-0.5">
                      {item.name} x {item.quantity} <span className="text-gray-500">({item.size})</span>
                      {index !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>
                <p className="mt-3 mb-2 font-medium">{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>

                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px] text-gray-600">Total Items: {order.items.length}</p>
                <p className="mt-3 ">Payment Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Order Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px]">Amount: {currency}{order.amount}</p>
              <select
                className='p-2'
                value={order.status || 'Order Placed'}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}

              >
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Ready to Shipped">Ready to Ship</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

          ))
        )}
      </div>
    </div >
  )
}

export default Orders
