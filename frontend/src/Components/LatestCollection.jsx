import React from 'react'
import { ShopContext } from '../Context/ShopContext'
import { Title } from './Title';
import { useContext, useEffect, useState } from 'react';
import ProductItem from './ProductItem';

export const LatestCollection = () => {
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(
        () => {
            if (products && products.length > 0) {
                setLatestProducts(products.slice(0, 10));
                setLoading(false);
            } else {
                setLoading(true);
            }
        }, [products]
    )

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'LATEST'} text2={'COLLECTIONS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                Step into the season with our freshest arrivals. From trend-setting styles to timeless essentials, discover pieces that elevate your everyday look. New drops, new vibes—shop what's hot right now.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {
                        latestProducts.map((item, index) => (
                            <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                        ))
                    }
                </div>
            )}
        </div>
    )
}
