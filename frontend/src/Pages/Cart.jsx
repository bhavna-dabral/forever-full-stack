import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Title } from '../Components/Title';
import { assets } from '../assets/assets';
import { CartTotal } from '../Components/CartTotal';
import { FaPlus, FaSmileBeam } from "react-icons/fa";
import { Link } from 'react-router-dom';


const Cart = () => {

  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item]
            })
          }
        }
      }
      setCartData(tempData)
    }

  }, [cartItems, products])
  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything yet</p>
          <a href="/collections" className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-600 transition">
            Browse Collections
          </a>
          <div className='flex gap-2 items-center mt-10 text-xl  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent font-semibold animate-bounce '>
            <p >HAPPY SHOPPING</p>
            <FaSmileBeam className="text-2xl animate-pulse text-indigo-500" />
          </div>
        </div>

      ) : (
        <>
          <div>
            {
              cartData.map((item, index) => {
                const productData = products.find((product) => product._id === item._id);

                return (
                  <div key={index} className='py-4 border-t border-b border-gray-200 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                    <div className='flex items-start gap-6'>
                      <img className='w-16 sm:w-20 ' src={productData.image[0]} />
                      <div>
                        <p className='text-sm sm:text-lg font-medium'>{productData.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                          <p>{currency}{productData.price}</p>
                          <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 border-gray-300 rounded-sm'>{item.size}</p>
                        </div>
                      </div>
                    </div>
                    <input onChange={(e) => e.target.value === '' || e.target.value === '0' ? null : updateQuantity(item._id, item.size, Number(e.target.value))} className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 border-gray-300 rounded-sm' type='number' min={1} defaultValue={item.quantity} />
                    <img src={assets.bin_icon} onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' />
                  </div>
                )

              })
            }
            <Link to='/collections' className='flex text-sm items-center justify-end text-indigo-400 gap-1'>
              <FaPlus className='text-xs' />
              <p>Add More Products</p>
            </Link>
          </div>
          <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <div className='w-full text-end'>
                <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-8 py-3 rounded-sm'>PROCEED TO CHECKOUT</button>

              </div>
            </div>

          </div>
        </>
      )}


    </div>
  )
}

export default Cart