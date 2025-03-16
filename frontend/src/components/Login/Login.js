import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function Login() {
  const navigate = useNavigate();
  const [isOtpSent, setIsOtpSent] = useState(false);  // Track OTP sent status
  const [email, setEmail] = useState("");  // Store email for OTP verification

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, values, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        toast.success("Login successful! Please check your email for the OTP.");
        setIsOtpSent(true);  // OTP has been sent, prompt for OTP
        setEmail(values.email);  // Store email for OTP verification
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error or server is down");
      }
    }
    setSubmitting(false);
  };

  const handleOtpVerification = async (values) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/verify-login-otp`, {
        email: email,
        otp: values.otp,
      });

      if (response.status === 200) {
        toast.success("OTP verified successfully. You are now logged in.");
        sessionStorage.setItem("user", JSON.stringify(response.data));

        navigate("/"); // Redirect to dashboard after OTP verification
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Network error or server is down");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        
        {isOtpSent ? (
  // OTP Verification Form
  <Formik
    key="otp-form" // unique key for OTP form
    initialValues={{ otp: "" }}
    onSubmit={handleOtpVerification}
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
) : (
  // Login Form
  <Formik
    key="login-form" // unique key for Login form
    initialValues={{ email: "", password: "" }}
    validationSchema={validationSchema}
    onSubmit={handleLogin}
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          Login
        </button>
      </Form>
    )}
  </Formik>
)}


             <p className="text-center mt-4">
        Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-700">Register</a>
      </p>

      <div className="mt-4 text-center">
      <button
        onClick={() => window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`} // Redirect to the backend
        className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700"
        >
        Login with Google
        </button>


        
             <p className="text-center mt-4">
        Forgot password <a href="/forgotpassword" className="text-blue-500 hover:text-blue-700">reset password</a>
      </p>
        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
