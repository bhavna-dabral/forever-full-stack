import React from 'react';

const Delivery = () => (
  <div className="max-w-3xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">Delivery Information</h1>
    <p className="mb-4 text-gray-700">We are committed to delivering your orders quickly and safely. Here’s everything you need to know about our delivery process:</p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Methods</h2>
    <ul className="list-disc ml-6 text-gray-700 mb-4">
      <li>Standard Delivery: 3-7 business days</li>
      <li>Express Delivery: 1-3 business days</li>
      <li>Free shipping on orders over $50</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">Order Tracking</h2>
    <p className="mb-4 text-gray-700">Once your order is shipped, you will receive a tracking number via email to monitor your delivery status.</p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Delivery Areas</h2>
    <p className="mb-4 text-gray-700">We deliver to most locations nationwide. If you have questions about delivery to your area, please contact our support team.</p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
    <p className="text-gray-700">For any delivery-related inquiries, reach out to us at connect@forever.com or call +1-212-456-7890.</p>
  </div>
);

export default Delivery;
