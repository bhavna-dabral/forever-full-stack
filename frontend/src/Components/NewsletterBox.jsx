import React from 'react'

export const NewsletterBox = () => {

    const onSubmitHandler = (e) => {
        e.preventDefault();
    }
    return (

        <div className='text-center'>

            <p className='text-2xl font-medium text-gray-800'>
                Subscribe now & get 20% off
            </p>

            <p className='text-gray-400 mt-3'>
                Join our family! Get the latest updates, style inspiration, and special offers delivered right to your inbox. 
            </p>

            <form onSubmit = {onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
                <input className='w-full sm:flex-1 outline-none' type ='email' placeholder='Enter your email' required/>
                <input className='bg-black text-white text-xs px-10 py-4' type='submit' value='Subscribe'/>
            </form>
        </div>

    )
}
