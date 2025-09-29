import React, { useState, useContext, useEffect } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully!')
        } else {
          toast.error(response.data.message || "Registration failed. Please try again.");
        }

      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success('Logged in successfully!')
        } else {
          toast.error(response.data.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {currentState === 'Login' ? '' : <input value={name} onChange={(e) => setName(e.target.value)} type='text' className='w-full px-3 py-2 border rounded-md border-gray-400' placeholder='Name' required />}
      <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' className='w-full px-3 py-2 border rounded-md border-gray-400' placeholder='Email' required />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' className='w-full px-3 py-2 border rounded-md border-gray-400' placeholder='Password' required />

      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <Link to='/forget-password' className='cursor-pointer'>Forget your Password ? </Link>
        {currentState === 'Login'
          ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create Account </p>
          : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here </p>}
      </div>

      <button className=' rounded-sm bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login