import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-5 py-5 mt-40 text-sm border-t border-gray-300'>
                <div>
                    <img src={assets.logo} className='mb-5 w-32' />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Forever is your go-to destination for the latest trends and timeless styles. We are committed to quality, comfort, and customer satisfaction—making every shopping experience memorable.
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/delivery">Delivery</Link></li>
                        <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+1-212-456-7890</li>
                        <li>connect@forever.com</li>
                    </ul>
                </div>
            </div>

            <div>
                <hr className='text-gray-300'/>
                <p className='py-5 text-sm text-center text-gray-700'>Copyright 2025@forever.com - All rights reserved </p>
            </div>
        </div>
    )
}
