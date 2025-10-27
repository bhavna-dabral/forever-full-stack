import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../Context/ShopContext'
import { useNavigate } from 'react-router-dom'
import api from "../api/axios";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext)

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState(0)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/user/send-reset-otp', { email })

      data.success ? toast.success(data.message) : toast.error(data.message);

      data.success && setIsEmailSent(true);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('');
      setOtp(otp)
      setIsOtpSubmitted(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post(backendUrl + '/api/user/reset-password', { email, otp, newPassword })

      data.success ? toast.success(data.message) : toast.error(data.message)

      data.success && navigate('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Reset Password</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {!isEmailSent &&
        <form onSubmit={onSubmitEmail} className='w-full flex flex-col gap-4'>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='email'
            className='w-full px-3 py-2 border rounded-md border-gray-400'
            placeholder='Enter your registered Email'
            required
          />

          <button disabled={loading} className='rounded-sm bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60'>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      }

      {!isOtpSubmitted && isEmailSent &&
        <form onSubmit={onSubmitOtp} className='w-full flex flex-col gap-4'>

          <p className='text-center mb-6 text-gray-600'>Enter the 6-digit code sent to your registered email id</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type='text' maxLength='1' key={index} required
                className='w-12 h-12  text-center text-xl rounded-md border border-gray-400'
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}

          </div>

          <button disabled={loading} className='rounded-sm bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60'>
            {loading ? 'Submitting...' : 'Submit'}
          </button>


        </form>
      }

      {isEmailSent && isOtpSubmitted &&

        <form onSubmit={onSubmitNewPassword} className='w-full flex flex-col gap-4'>
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type='password'
            className='w-full px-3 py-2 border rounded-md border-gray-400'
            placeholder='Create your new password'
            required
          />


          <button disabled={loading} className='rounded-sm bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60'>
            {loading ? 'Submitting...' : 'Submit'}
          </button>

        </form>
      }

      <div className='w-full flex text-gray-500 justify-center text-sm mt-[-8px]'>
        <Link to='/login' className='cursor-pointer'>Back to Login </Link>
      </div>

    </div>
  )
}

export default ResetPassword

