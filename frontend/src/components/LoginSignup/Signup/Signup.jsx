import React, { useState } from "react";
import { SiGmail } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../../App.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    console.log("Google Sign-In");
    navigate("/");
  };

  const signInWithFacebook = () => {
    console.log("Facebook Sign-In");
    navigate("/");
  };

  const signIn = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Email Sign-Up:", { email, password });

    setSuccess("Sign-Up successful!");
    setError("");
    navigate("/");
  };

  return (
    <div className="bg-image">
      <div className="min-h-screen flex flex-row align-middle items-center justify-center bg-gray-100 bg-image gap-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
          <div className="flex justify-center mb-2">
            <div className="icon-circle" onClick={signInWithGoogle}>
              <SiGmail size={30} />
            </div>
            <div className="icon-circle" onClick={signInWithFacebook}>
              <FaFacebook size={30} />
            </div>
          </div>
          <div className="flex flex-row justify-center">
            <p>or with:</p>
          </div>
          <form onSubmit={signIn}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 mb-4 text-lg text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 mb-4 text-lg text-center">
                {success}
              </div>
            )}
            <div className="flex flex-row justify-center gap-4">
              <button
                type="submit"
                className="w-1/3 bg-blue-600 text-white p-2 mt-4 hover:bg-blue-600 rounded-3xl mb-2"
              >
                SIGN UP
              </button>
            </div>
            <div className="flex flex-row justify-center text-center">
              <p>
                Already a user?{" "}
                <span className="text-blue-600">
                  <Link to="/login">Login Here</Link>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
