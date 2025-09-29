import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const Add = ({token}) => {

  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("price",price)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("sizes", JSON.stringify(sizes));
      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + '/api/product/add', formData, {headers: {token}})

      if(response.data.success){
        toast.success(response.data.message)
        setName("")
        setDescription("")
        setPrice("")
        setCategory("Men")
        setSubCategory("Topwear")
        setBestseller(false)
        setSizes([])
      }else{
        toast.error(response.data.message)
      }
    }
     catch (error) {
      console.log(error.message)
    }
  }

  return (
    <form onSubmit = {onSubmitHandler} className="w-full max-w-2xl mx-auto mt-8 bg-white shadow-lg rounded-xl p-4 sm:p-8 flex flex-col gap-6">

      <div>
        <p className="text-lg font-semibold text-black mb-3">Upload Image</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

          <label htmlFor="image1" className="flex flex-col items-center cursor-pointer group">
            <img
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt="Upload 1"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain border-2 border-dashed border-gray-300 rounded-lg group-hover:border-black transition"
            />
            <input
              type="file"
              id="image1"
              hidden
              required
              onChange={(e) => setImage1(e.target.files[0])}
            />
          </label>


          <label htmlFor="image2" className="flex flex-col items-center cursor-pointer group">
            <img
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)}
              alt="Upload 2"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain border-2 border-dashed border-gray-300 rounded-lg group-hover:border-black transition"
            />
            <input
              type="file"
              id="image2"
              hidden
              onChange={(e) => setImage2(e.target.files[0])}
            />
          </label>


          <label htmlFor="image3" className="flex flex-col items-center cursor-pointer group">
            <img
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)}
              alt="Upload 3"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain border-2 border-dashed border-gray-300 rounded-lg group-hover:border-black transition"
            />
            <input
              type="file"
              id="image3"
              hidden
              onChange={(e) => setImage3(e.target.files[0])}
            />
          </label>


          <label htmlFor="image4" className="flex flex-col items-center cursor-pointer group">
            <img
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)}
              alt="Upload 4"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain border-2 border-dashed border-gray-300 rounded-lg group-hover:border-black transition"
            />
            <input
              type="file"
              id="image4"
              hidden
              onChange={(e) => setImage4(e.target.files[0])}
            />
          </label>
        </div>

      </div>

      {/* Product Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="productName" className="font-medium text-black">Product Name</label>
        <input
          onChange={(e) => setName(e.target.value)} value={name}
          id="productName"
          name="productName"
          type="text"
          placeholder="Enter product name"
          className="px-4 py-2 transition w-full"
          required
        />
      </div>

      {/* Product Description */}
      <div className="flex flex-col gap-2">
        <label htmlFor="productDescription" className="font-medium text-black">Product Description</label>
        <textarea
          onChange={(e) => setDescription(e.target.value)} value={description}
          id="productDescription"
          name="productDescription"
          placeholder="Enter product description"
          className="px-4 py-2 transition w-full resize-none"
          rows={3}
          required
        />
      </div>

      {/* Category, Subcategory, Price */}
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-between">
        {/* Product Category */}
        <div className="flex flex-col gap-2 w-full sm:w-1/3">
          <label htmlFor="productCategory" className="font-medium text-black mb-2">Product Category</label>
          <select
            onChange={(e) => setCategory(e.target.value)}
            id="productCategory"
            name="productCategory"
            className="px-4 py-2 transition w-full"
            required
          >
            <option value="">Select category</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </div>
        {/* Subcategory */}
        <div className="flex flex-col gap-2 w-full sm:w-1/3">
          <label htmlFor="productSubcategory" className="font-medium text-black mb-2">Subcategory</label>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            id="productSubcategory"
            name="productSubcategory"
            className="px-4 py-2 transition w-full"
            required
          >
            <option value="">Select subcategory</option>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>
        {/* Price */}
        <div className="flex flex-col gap-2 w-full sm:w-1/3">
          <label htmlFor="productPrice" className="font-medium text-black mb-2">Price</label>
          <input
            onChange={(e) => setPrice(e.target.value)} value={price}
            id="productPrice"
            name="productPrice"
            type="number"
            min="0"
            placeholder="Enter price"
            className="px-4 py-2 transition w-full"
            required
          />
        </div>
      </div>

      {/* Available Sizes (Checkboxes) */}
      <div className="flex flex-col gap-2">
        <span className="font-medium text-black mb-1">Available Sizes</span>
        <div className="flex flex-wrap flex-col sm:flex-row gap-4">
          {SIZES.map((size) => (
            <label key={size} className="flex  items-center gap-2 cursor-pointer text-sm">
              <input
                onClick={() =>
                  setSizes(prev =>
                    prev.includes(size)
                      ? prev.filter(item => item !== size)
                      : [...prev, size]
                  )
                }

                type="checkbox"
                name="productSizes"
                value={size}
                className="accent-[#C586A5] w-4 h-4"
              />
              <span>{size}</span>
            </label>
          ))}
        </div>
      </div>

      <div className='items-center gap-2 flex mt-2'>
        <input type='checkbox' id='bestseller' className="accent-[#C586A5] w-4 h-4" onChange = {() => setBestseller(prev =>!prev)} checked={bestseller} />
        <label className='cursor-pointer' htmlFor='bestSeller'>Add to Bestseller</label>
      </div>

      <button  className='w-28 py-3 mt-4 bg-black text-white' type='submit'>ADD</button>
    </form>
  )
}

export default Add
