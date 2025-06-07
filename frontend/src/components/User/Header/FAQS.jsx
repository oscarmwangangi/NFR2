import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      category: "orders",
      question: "How do I place an order?",
      answer: "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide shipping information and payment details to complete your purchase."
    },
    {
      category: "orders",
      question: "Can I modify or cancel my order?",
      answer: "You can modify or cancel your order within 30 minutes of placement. After that, we begin processing your order and changes may not be possible. Contact our support team immediately if you need assistance."
    },
    {
      category: "shipping",
      question: "What are the shipping options?",
      answer: "We offer standard shipping (3-5 business days), express shipping (1-2 business days), and overnight shipping for an additional fee. Shipping costs vary based on package size and destination."
    },
    {
      category: "shipping",
      question: "Do you ship internationally?",
      answer: "Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary based on destination. Customs duties may apply and are the responsibility of the recipient."
    },
    {
      category: "returns",
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be unused, in original packaging, and with all tags attached. Some items like electronics have a 14-day return window."
    },
    {
      category: "returns",
      question: "How do I initiate a return?",
      answer: "To initiate a return, go to your account orders section, select the item you wish to return, and follow the prompts. You'll receive a return label to print and attach to your package."
    },
    {
      category: "payments",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. We also offer installment payment options through select providers."
    },
    {
      category: "payments",
      question: "Is my payment information secure?",
      answer: "Absolutely. We use industry-standard encryption and never store your full payment details. All transactions are processed through PCI-compliant payment gateways to ensure maximum security."
    },
    {
      category: "account",
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link. If you don't see it, check your spam folder or contact support for assistance."
    },
    {
      category: "account",
      question: "Can I have multiple addresses saved?",
      answer: "Yes, you can save multiple shipping addresses in your account. During checkout, you can select from your saved addresses or add a new one."
    }
  ];

  // Filter FAQs based on search term and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Category data for filtering
  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'orders', name: 'Orders' },
    { id: 'shipping', name: 'Shipping' },
    { id: 'returns', name: 'Returns' },
    { id: 'payments', name: 'Payments' },
    { id: 'account', name: 'Account' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-[#f0f0f0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-[#313133] mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about orders, shipping, returns, payments, and more. 
            Can't find what you're looking for? <span className="text-red-600 font-medium">Contact our support team</span>.
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg 
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <Link to="/chat">
            <button className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                Contact Support
            </button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-[#313133] pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0 ml-4">
                    {activeIndex === index ? (
                      <svg 
                        className="h-6 w-6 text-red-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    ) : (
                      <svg 
                        className="h-6 w-6 text-red-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-2 border-t border-gray-100">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <svg 
                className="h-16 w-16 mx-auto text-gray-400 mb-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No matching questions found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter. If you can't find what you're looking for, 
                our support team is ready to help.
              </p>
              <button className="mt-6 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors">
                Contact Support
              </button>
            </div>
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-gradient-to-r from-red-500 to-red-700 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still have questions?
              </h2>
              <p className="text-red-100 max-w-xl">
                Our dedicated support team is available 24/7 to assist you with any questions 
                or concerns you may have about your orders, products, or account.
              </p>
            </div>


<div className="md:w-1/3 flex justify-center">
  <Link to="/chat">
    <button className="px-8 py-4 bg-white text-red-600 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-colors flex items-center">
      <svg 
        className="h-5 w-5 mr-2" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
      Contact Support
    </button>
  </Link>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQs;