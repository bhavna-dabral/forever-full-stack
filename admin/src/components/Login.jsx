import React, { useState } from 'react'
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      console.log(email, password);
      const response = await axios.post(backendUrl + '/api/user/admin', { email, password });
      console.log(response)
      if (response.data.success) {
        setToken(response.data.token)
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-black">Admin Panel</h1>
        <form onSubmit={onSubmitHandler} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Email address</label>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type='email' placeholder='your@email.com' required className="border border-gray-300 rounded-lg px-4 py-2 outline-none transition" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' placeholder='Enter your password' required className="border border-gray-300 rounded-lg px-4 py-2 outline-none transition" />
          </div>
          <button type='submit' className="mt-2 bg-black hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition">Login</button>
        </form>
      </div>
    </div>
  )
}

export default Login;
