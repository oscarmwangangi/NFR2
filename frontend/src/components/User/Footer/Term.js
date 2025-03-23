import React, { useEffect } from 'react';
import { FiAlertTriangle, FiFileText, FiShoppingBag, FiCreditCard, FiShield, FiRefreshCw, FiUser } from 'react-icons/fi';

const Term = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-red-500 text-white rounded-lg p-8 mb-12 flex items-center space-x-4">
          <FiFileText className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">NFR Terms & Conditions</h1>
            <p className="mt-2 opacity-90">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-8">
            {/* Introduction */}
            <section className="border-b pb-8">
              <div className="flex items-center mb-4">
                <FiShoppingBag className="text-red-500 text-2xl mr-2" />
                <h2 className="text-2xl font-semibold">1. Introduction</h2>
              </div>
              <p className="text-gray-600">
                Welcome to NFR ("we," "our," or "us"). These Terms & Conditions govern your use of 
                our e-commerce platform located at www.nfr.market. By accessing or using our services, 
                you agree to be bound by these terms.
              </p>
            </section>

            {/* User Obligations */}
            <section className="border-b pb-8">
              <div className="flex items-center mb-4">
                <FiUser className="text-red-500 text-2xl mr-2" />
                <h2 className="text-2xl font-semibold">2. User Responsibilities</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Provide accurate account information</li>
                <li>Maintain confidentiality of login credentials</li>
                <li>Use services only for lawful purposes</li>
                <li>Do not engage in fraudulent activities</li>
              </ul>
            </section>

            {/* Payments */}
            <section className="border-b pb-8">
              <div className="flex items-center mb-4">
                <FiCreditCard className="text-red-500 text-2xl mr-2" />
                <h2 className="text-2xl font-semibold">3. Payment Terms</h2>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>We accept the following payment methods:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>M-Pesa</li>
                  <li>Credit/Debit Cards</li>
                  <li>Cash on Delivery (Nairobi only)</li>
                </ul>
                <p className="mt-2">
                  All prices are in Kenyan Shillings (KES) and inclusive of VAT where applicable.
                </p>
              </div>
            </section>

            {/* Returns */}
            <section className="border-b pb-8">
              <div className="flex items-center mb-4">
                <FiRefreshCw className="text-red-500 text-2xl mr-2" />
                <h2 className="text-2xl font-semibold">4. Returns & Refunds</h2>
              </div>
              <div className="space-y-2 text-gray-600">
                <p>Our return policy includes:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>7-day return window for defective items</li>
                  <li>Original packaging required</li>
                  <li>Refunds processed within 5 business days</li>
                </ul>
              </div>
            </section>

            {/* Liability */}
            <section className="border-b pb-8">
              <div className="flex items-center mb-4">
                <FiShield className="text-red-500 text-2xl mr-2" />
                <h2 className="text-2xl font-semibold">5. Liability Limitations</h2>
              </div>
              <p className="text-gray-600">
                NFR shall not be liable for any indirect, incidental, or consequential damages arising 
                from the use of our platform. Our total liability for any claim shall not exceed the 
                value of the order in question.
              </p>
            </section>

            {/* Disputes */}
            <section>
              <div className="flex items-center mb-4">
                <FiAlertTriangle className="text-red-500 text-2xl mr-2" />
                <h2 className="text-2xl font-semibold">6. Governing Law</h2>
              </div>
              <p className="text-gray-600">
                These terms shall be governed by and construed in accordance with the laws of Kenya. 
                Any disputes shall be resolved through arbitration in Nairobi.
              </p>
            </section>

            {/* Contact */}
            <div className="mt-12 p-6 bg-red-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FiAlertTriangle className="text-red-500 mr-2" />
                Need Help?
              </h3>
              <p className="text-gray-600">
                Contact our legal team at legal@nfr.market or call +254 700 123 456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Term;