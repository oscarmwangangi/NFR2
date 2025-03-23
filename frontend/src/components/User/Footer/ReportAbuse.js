// ReportAbuse.js
import React, { useState,useEffect} from 'react';
import { FiAlertTriangle, FiMail, FiFileText, FiChevronDown, FiPhone, FiCheckCircle } from 'react-icons/fi';

const ReportAbuse = () => {

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
  const [formData, setFormData] = useState({
    email: '',
    issueType: '',
    description: '',
    attachments: null
  });
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    'Fraudulent Activity',
    'Inappropriate Content',
    'Product Misrepresentation',
    'Privacy Violation',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData instance for file upload and other fields
    const dataToSend = new FormData();
    dataToSend.append('email', formData.email);
    dataToSend.append('issueType', formData.issueType);
    dataToSend.append('description', formData.description);
    if (formData.attachments) {
      dataToSend.append('attachment', formData.attachments);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/submit_report`, {
        method: 'POST',
        body: dataToSend,
      });
      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      // Reset the form inputs after a successful submission
      setFormData({
        email: '',
        issueType: '',
        description: '',
        attachments: null
      });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert(result.message || 'Error submitting report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files[0] });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Red header section */}
        <div className="bg-red-500 rounded-t-lg p-6 flex items-center space-x-4">
          <FiAlertTriangle className="text-white text-3xl" />
          <h1 className="text-2xl font-bold text-white">Report Abuse - NFR Marketplace</h1>
        </div>

        <div className="bg-white shadow-lg rounded-b-lg px-8 pt-6 pb-8 mb-4">
          {submitted ? (
            <div className="text-center p-8">
              <FiCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Report Submitted Successfully</h2>
              <p className="text-gray-600">Our team will review your report within 24 hours</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Your Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute text-red-500 text-xl top-3 left-3" />
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Issue Type Dropdown */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Type of Issue
                </label>
                <div className="relative">
                  <FiChevronDown className="absolute right-3 top-3 text-gray-400 text-xl pointer-events-none" />
                  <select
                    required
                    className="w-full appearance-none py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={formData.issueType}
                    onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                  >
                    <option value="">Select an issue type</option>
                    {issueTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Detailed Description
                </label>
                <div className="relative">
                  <FiFileText className="absolute text-red-500 text-xl top-3 left-3" />
                  <textarea
                    required
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-32"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Attach Evidence (Optional)
                </label>
                <div className="relative border-2 border-dashed border-red-100 rounded-lg p-6 text-center hover:border-red-200 transition-colors">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                  <p className="text-gray-600">
                    {formData.attachments 
                      ? formData.attachments.name 
                      : 'Click to upload screenshots or documents'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FiAlertTriangle className="text-xl" />
                <span>Submit Report</span>
              </button>
            </form>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center text-gray-600 text-sm mt-6">
          <p className="flex items-center justify-center space-x-2">
            <FiMail className="text-red-500" />
            <span>For urgent matters: abuse@nfr.market</span>
          </p>
          <p className="mt-2 flex items-center justify-center space-x-2">
            <FiPhone className="text-red-500" />
            <span>24/7 Support Hotline: +254 700 123 456</span>
          </p>
          <p className="mt-4 text-xs text-gray-500">
            All reports are confidential. NFR takes abuse reports seriously and will respond within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportAbuse;
