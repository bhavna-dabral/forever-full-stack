import React from 'react'
import { Title } from '../Components/Title';
import { NewsletterBox } from '../Components/NewsletterBox'


const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-10 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center items-center lg:flex-row gap-16'>
        <img className='w-[70%] lg:max-w-[480px]' src='https://res.cloudinary.com/dfelqef5x/image/upload/v1751818079/wvuxlgy1tlcd3ujsn8ff.png'/>
        <div className='flex flex-col justify-center gap-6 lg:w-2/4 text-gray-600'>
          <p className = 'text-gray-600' >Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.</p>
          <p className = 'text-gray-600' >Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p className = 'text-gray-600' >Our mission at Forever is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>

        </div>

      </div>
      <div className=' text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-3'>
        <div className='border border-gray-300 rounded-md px-10  md:px-8 py-8 sm:py-10 lg:py-20 lg:px-16 flex flex-col gap-5 '>
          <b>Quality Assurance :</b>
          <p> We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
        </div>
        <div className='border border-gray-300 rounded-md px-10  md:px-8 py-8 sm:py-10 lg:py-20 lg:px-16 flex flex-col gap-5 '>
          <b>Convenience :</b>
          <p> With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
        </div>
        <div className='border border-gray-300 rounded-md px-10  md:px-8 py-8 sm:py-10 lg:py-20 lg:px-16 flex flex-col gap-5 '>
          <b>Exceptional Customer Service :</b>
          <p> Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
        </div>
      </div>

      <NewsletterBox/>
    </div>
  )
}

export default About