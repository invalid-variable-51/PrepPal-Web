import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"; // Import react-hot-toast
import "../index.css"; 

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Show a processing toast
    const toastId = toast.loading("Processing registration...");

    try {
      const response = await axios.post(`${process.env.VITE_BACKEND_URL}/api/auth/signup`, {
        email,
        name,
        password,
      });
      console.log(response.data);

      // Update the toast with success message
      toast.success("Registration successful! Redirecting to verify email...", {
        id: toastId,
      });

      // Redirect to the verify email page after a short delay
      setTimeout(() => {
        navigate("/verify-email");
      }, 2000);
    } catch (error) {
      console.error(error);

      // Update the toast with an error message
      toast.error("Registration failed!", { id: toastId });
    }
  };

  const handleSignIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-5 md:p-14 my-20 mx-9 poppins bg-black text-white rounded-lg">
      <Toaster /> {/* Add Toaster component */}

      {/* Left section */}
      <div className="w-full md:w-1/2 space-y-4 mb-8 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          Study Start Now
        </h1>
        <p className="text-gray-400 text-lg">Create your PrepPal AI account.</p>
      </div>

      {/* Right section - Signup Form */}
      <div className="w-full md:w-1/2 max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-black">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md text-black bg-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md text-black bg-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md text-black bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 rounded-md text-white bg-black hover:bg-gray-900"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-400">
          Literally you probably haven't heard of them.
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <a href="/login" onClick={handleSignIn} className="font-medium hover:underline text-grey">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
