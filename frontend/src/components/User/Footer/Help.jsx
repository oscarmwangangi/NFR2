import React, { useState,useEffect } from "react";
import { FiChevronDown, FiShoppingCart, FiPackage, FiCreditCard, FiMessageSquare, FiPhone } from "react-icons/fi";

const Help = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const cards = [
    { id: "order", title: "Place an Order", icon: <FiShoppingCart /> },
    { id: "track", title: "Track Your Order", icon: <FiPackage /> },
    { id: "pay", title: "Pay for Your Order", icon: <FiCreditCard /> },
  ];

  const sidebarItems = [
    { id: "payments", title: "Payments", icon: <FiCreditCard /> },
    { id: "delivery", title: "Delivery", icon: <FiPackage /> },
    { id: "livechat", title: "Live Chat", icon: <FiMessageSquare /> },
    { id: "call", title: "Call", icon: <FiPhone /> },
  ];

  const [activeCard, setActiveCard] = useState(cards[0].id);
  const [activeSidebar, setActiveSidebar] = useState(sidebarItems[0].id);
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleExpand = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const cardContent = {
    order: {
      brief: "Start your NFR shopping journey",
      details: (
        <div className="space-y-3">
          <p className="font-semibold">How to place an order:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>Browse products and click on any item to view details</li>
            <li>Select size/color (if applicable) and click 'Add to Cart'</li>
            <li>Review items in cart (top right cart icon)</li>
            <li>Proceed to checkout and fill shipping details</li>
            <li>Choose payment method and confirm order</li>
          </ol>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <FiShoppingCart className="inline mr-2" />
            Your cart updates in real-time. Max 10 items per order.
          </div>
        </div>
      ),
    },
    track: {
      brief: "Monitor your order progress",
      details: (
        <div className="space-y-3">
          <p>After successful order placement:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Go to your account dropdown (top right profile icon)</li>
            <li>Click 'My Orders' to view order status</li>
            <li>Active orders show real-time tracking updates</li>
            <li>Contact support if order doesn't arrive within 5 business days</li>
          </ul>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <FiPackage className="inline mr-2" />
            Standard delivery: 3-5 business days | Express: 1-2 days
          </div>
        </div>
      ),
    },
    pay: {
      brief: "Secure payment options",
      details: (
        <div className="space-y-3">
          <p className="font-semibold text-red-600">Accepted Payment Methods:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg bg-white">
              <h4 className="font-medium mb-1">M-Pesa</h4>
              <p className="text-sm">Complete payment via M-Pesa prompt after order confirmation</p>
            </div>
            <div className="p-3 border rounded-lg bg-white">
              <h4 className="font-medium mb-1">Cash on Delivery</h4>
              <p className="text-sm">Pay cash when receiving your order (KES 50 fee applies)</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            All transactions are secured with SSL encryption. We never store your payment details.
          </p>
        </div>
      ),
    },
  };

  const sidebarContent = {
    payments: {
      brief: "Payment options available",
      details: (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Accepted Methods:</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-24 font-medium">M-Pesa:</span>
                <span>+254 708 342 901 (NFR Payments)</span>
              </li>
              <li className="flex items-center">
                <span className="w-24 font-medium">Cash:</span>
                <span>Available for Nairobi deliveries</span>
              </li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">
            Payments are processed immediately. Contact us within 12 hours for refund requests.
          </p>
        </div>
      ),
    },
    delivery: {
      brief: "Shipping & tracking information",
      details: (
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">Tracking Steps:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Login to your NFR account</li>
              <li>Navigate to 'Account'</li>
              <li>Click 'Orders'</li>
              <li>View real-time updates with delivery timeline</li>
            </ol>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <FiPackage className="inline mr-2" />
            Contact support if tracking information doesn't update within 24 hours
          </div>
        </div>
      ),
    },
    livechat: {
      brief: "Instant messaging support",
      details: (
        <div className="space-y-4">
          <a
            href="/chat"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiMessageSquare className="mr-2" />
            Start Live Chat Now
          </a>
          <p className="text-sm text-gray-600">
            Available daily 8AM - 10PM EAT. Average response time: 2 minutes
          </p>
        </div>
      ),
    },
    call: {
      brief: "Direct phone support",
      details: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Contact Numbers:</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <FiPhone className="mr-2" />
                Main Support: +254 717 554 384
              </p>
              <p className="flex items-center">
                <FiPhone className="mr-2" />
                Delivery Issues: +254 732 887 921
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Call center hours: Monday-Saturday 7:30AM - 8:30PM EAT
          </p>
        </div>
      ),
    },
  };

  return (
    <div className="p-5 font-sans max-w-7xl mx-auto">
      {/* Reddish header */}
      <div className="bg-red-500 h-40 rounded-lg flex items-center justify-center relative">
        <h1 className="text-white text-2xl font-bold drop-shadow-lg text-center px-4">
          Hello, welcome to NFR! How may we help you?
        </h1>
      </div>

      {/* Cards container overlapping the header */}
      <div className="flex justify-center gap-4 relative -mt-12 z-10">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`w-64 flex items-center p-4 bg-white rounded-lg shadow-lg transition-all duration-300 cursor-pointer ${
              activeCard === card.id
                ? "border-2 border-red-500 -translate-y-2"
                : "border hover:-translate-y-1"
            }`}
            onClick={() => setActiveCard(card.id)}
          >
            <span className="text-red-500 mr-3 text-xl">{card.icon}</span>
            <h3 className="font-medium text-gray-800">{card.title}</h3>
          </div>
        ))}
      </div>

      {/* Main section with sidebar and content */}
      <div className="flex flex-col lg:flex-row gap-8 mt-16">
        {/* Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                activeSidebar === item.id
                  ? "bg-red-500 text-white shadow-lg"
                  : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setActiveSidebar(item.id)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.title}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {/* Card Content */}
          <SectionBox
            title={cards.find((c) => c.id === activeCard).title}
            content={cardContent[activeCard]}
            type="card"
            isExpanded={expandedSection === `card-${activeCard}`}
            onToggle={() => toggleExpand(`card-${activeCard}`)}
          />

          {/* Sidebar Content */}
          <SectionBox
            title={sidebarItems.find((s) => s.id === activeSidebar).title}
            content={sidebarContent[activeSidebar]}
            type="sidebar"
            isExpanded={expandedSection === `sidebar-${activeSidebar}`}
            onToggle={() => toggleExpand(`sidebar-${activeSidebar}`)}
          />
        </div>
      </div>
    </div>
  );
};

const SectionBox = ({ title, content, type, isExpanded, onToggle }) => (
  <div
    className={`border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-300 ${
      isExpanded ? "shadow-lg" : "shadow-sm"
    }`}
    onClick={onToggle}
  >
    <div className="p-4 cursor-pointer">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div
          className={`p-2 rounded-full transition-all ${
            isExpanded ? "bg-red-100 text-red-600 rotate-180" : "hover:bg-gray-100"
          }`}
        >
          <FiChevronDown />
        </div>
      </div>
      <p className="mt-2 text-gray-600">{content.brief}</p>
    </div>
    <div
      className={`px-3 pb-3 transition-all duration-300 ${
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="pt-4 border-t border-gray-100">{content.details}</div>
    </div>
  </div>
);

export default Help;