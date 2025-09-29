import React, {useState, useEffect} from 'react'
import { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/assets';
 const SearchBar = () => {
  const { search, setSearch, setShowSearch } = useContext(ShopContext);

  return (
    <div className='w-full'>
      <div className='flex items-center border border-gray-300 bg-white px-4 py-2 rounded-md shadow-sm focus-within:border-gray-500 transition duration-200'>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400'
          type='text'
          placeholder='Search products...'
        />
        <button onClick={() => setShowSearch(false)} aria-label="Close search">
          <img
            src={assets.cross_icon}
            alt="Close"
            className='w-2 h-2 ml-2 cursor-pointer hover:scale-110 transition-transform duration-200'
          />
        </button>
      </div>
    </div>
  );
};


export default SearchBar
