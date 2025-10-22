import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './Components/Navbar'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Collections from './Pages/Collections'
import Orders from './Pages/Orders'
import PlaceOrder from './Pages/PlaceOrder'
import Contact from './Pages/Contact'
import Cart from './Pages/Cart'
import Product from './Pages/Product'
import Profile from './Pages/Profile'
import { Footer } from './Components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import Delivery from './Pages/Delivery';
import ScrollToTop from './Components/ScrollToTop';
import NotFoundPage from './Pages/NotFoundPage'
import ResetPassword from './Pages/ResetPassword'

export const backendUrl = import.meta.env.VITE_BACKEND_URL


const App = () => {
  return (
    <div className = "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] ">
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Navbar/>
      <ScrollToTop />
      <Routes>
        <Route path = "/" element = {<Home />} />
        <Route path = "/collections" element = {<Collections />} />
        <Route path = "/about" element = {<About />} />
        <Route path = "/contact" element = {<Contact />} />
        <Route path = "/product/:productId" element = {<Product />} />
        <Route path = "/cart" element = {<Cart />} />
        <Route path = "/login" element = {<Login />} />
        <Route path = "/place-order" element = {<PlaceOrder />} />
        <Route path = "/orders" element = {<Orders />} />
        <Route path = "/profile" element = {<Profile />} />
        <Route path = "/privacy-policy" element={<PrivacyPolicy />} />
        <Route path = "/forget-password" element = {<ResetPassword/>}/>
        <Route path = "/delivery" element={<Delivery />} />
        <Route path = "*" element = {<NotFoundPage/>}/>   
      </Routes>
      
      <Footer/>

    </div>
  )
}

export default App