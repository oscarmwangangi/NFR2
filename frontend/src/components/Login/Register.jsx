import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';


const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  first_name: Yup.string().required('First name is required'),
  second_name: Yup.string().required('Second name is required'),
});

function Register() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState(""); // Store OTP
  const [email, setEmail] = useState(""); // Store email
  const [registrationData, setRegistrationData] = useState({}); // Store registration form data
  const navigate = useNavigate();

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, values);
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsOtpSent(true);
        setEmail(values.email); // Save email to send OTP verification
        setRegistrationData(values); // Save registration data for OTP verification
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Network error or server is down');
      }
    }
    setSubmitting(false);
  };

  const handleVerifyOtp = async (otpValue) => {
    try {
      // Ensure the form values are correctly passed
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-otp`, { 
        email, 
        otp: otpValue, 
        password: registrationData.password, 
        first_name: registrationData.first_name, 
        second_name: registrationData.second_name 
      });
  
      if (response.status === 200) {
        toast.success('User registered successfully');
        // Redirect or show success message
        setTimeout(() => {
            navigate('/login'); // Redirect after the delay
          }, 5000); // 5000 ms = 5 seconds
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response || error);
      toast.error(error.response?.data?.message || 'OTP verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
        {!isOtpSent ? (
          <Formik
            initialValues={{ email: "", password: "", first_name: "", second_name: "" }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="first_name" component="div" className="text-red-500 text-sm" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="second_name"
                    placeholder="Second Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="second_name" component="div" className="text-red-500 text-sm" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Register
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Verify Email</h2>
            <p className="mb-4">We have sent a verification OTP to your email. Please enter it below:</p>
            <Formik
              initialValues={{ otp: "" }}
              onSubmit={(values, { setSubmitting }) => {
                handleVerifyOtp(values.otp); // Pass only OTP here, other data is already in state
                setSubmitting(false);
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <Field
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    Verify OTP
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
