import React from 'react'
import { Title } from '../Components/Title'


const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex justify-center items-center  gap-10 mb-28'>
        <img className='w-[50%] max-w-[350px]' src= 'https://res.cloudinary.com/dfelqef5x/image/upload/v1751818216/xxks99phqpxijxmgyrrz.png' />
        <div className='flex flex-col justify-center items-start gap-6 '>
          <p className = 'font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>1235 XYZ Building<br/>ABC, Pune, India</p>
          <p className='text-gray-500'>Tel: (415) 555-0132 <br/>Email: admin@forever.com</p>
        </div>
      </div>
    </div>
  )
}

export default Contact
