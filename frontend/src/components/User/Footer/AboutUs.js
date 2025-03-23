import React, { useEffect } from 'react';
import { FiTruck, FiShoppingBag, FiHeart, FiUsers, FiMapPin, FiClock } from 'react-icons/fi';

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-500 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About NFR</h1>
          <p className="text-xl md:text-2xl mb-8">Redefining Online Shopping in Kenya</p>
          <div className="flex justify-center space-x-4">
            <FiShoppingBag className="text-3xl animate-bounce" />
            <FiHeart className="text-3xl animate-pulse" />
            <FiTruck className="text-3xl animate-bounce" />
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 text-lg">
              Founded in 2023, NFR has quickly become Kenya's fastest-growing e-commerce platform. 
              What started as a small idea to connect local businesses with tech-savvy consumers 
              has blossomed into a nationwide movement.
            </p>
            <p className="text-gray-600 text-lg">
              We're committed to delivering an unmatched shopping experience with 
              <span className="text-red-500 font-semibold"> fast delivery</span>, 
              <span className="text-red-500 font-semibold"> secure payments</span>, and 
              <span className="text-red-500 font-semibold"> exceptional customer service</span>.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1556742205-e10c9486e506" 
              alt="NFR Team" 
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-red-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <FiHeart className="text-red-500 text-4xl" />, 
                title: "Customer First", 
                text: "Your satisfaction drives every decision we make" },
              { icon: <FiUsers className="text-red-500 text-4xl" />, 
                title: "Community Focus", 
                text: "Supporting local businesses and communities" },
              { icon: <FiTruck className="text-red-500 text-4xl" />, 
                title: "Fast Delivery", 
                text: "Nationwide delivery within 1-3 business days" },
            ].map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-8 text-center">
          <div className="p-6">
            <div className="text-red-500 text-4xl font-bold mb-2">50k+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="p-6">
            <div className="text-red-500 text-4xl font-bold mb-2">10k+</div>
            <div className="text-gray-600">Products Available</div>
          </div>
          <div className="p-6">
            <div className="text-red-500 text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
          <div className="p-6">
            <div className="text-red-500 text-4xl font-bold mb-2">47</div>
            <div className="text-gray-600">Counties Served</div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105">
                <img 
                  src="/download.png"
                  alt="Team member"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Team Member {item}</h3>
                  <p className="text-red-500 mb-4">Team Leader</p>
                  <p className="text-gray-600">Passionate about delivering exceptional shopping experiences</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Banner */}
      <div className="bg-red-500 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Have Questions?</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <FiMapPin className="mr-2 text-xl" />
              <span>Nairobi, Kenya</span>
            </div>
            <div className="flex items-center">
              <FiClock className="mr-2 text-xl" />
              <span>Mon-Fri: 8AM - 6PM EAT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;