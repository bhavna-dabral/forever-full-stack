import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Title } from '../Components/Title';
import axios from 'axios';

const Orders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrderData = async () => {
    try {
      setLoading(true);

      if (!token) {
        setLoading(false);
        return null
      }

      const response = await axios.post(backendUrl+ '/api/order/userorders', {}, {headers: {token}})
         if(response.data.success){
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : orderData.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className='mb-8'>
          You haven't placed any orders yet.<br />
          Start shopping and your orders will appear here!
          </p>

          <a href="/collections" className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-600 transition">
            Browse Collections
          </a>
        </div>
      ) : (<div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-gray-300 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency} {item.price}</p>
                    <p> Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>

              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{item.status}</p>
                </div>
                <button onClick={loadOrderData} className='border border-gray-300 px-4 py-2 text-sm font-medium rounded-sm text-gray-500'>Track Order</button>
              </div>


            </div>
          ))
        }
      </div>)}

    </div>
  )
}

export default Orders