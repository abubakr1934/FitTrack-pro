import React, { useState } from "react";
import {
  auth,
  googleProvider,
  FacebookProvider,
} from "../../../config/Firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import "../../../App.css";
import { SiGmail } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const signIn = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created successfully - redirecting now.");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithGoogle = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess("Logged in successfully with Google - redirecting now.");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const signInWithFacebook = async (e) => {
    e.preventDefault();
    try {
      await signInWithPopup(auth, FacebookProvider);
      setSuccess("Logged in successfully with Facebook - redirecting now.");
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    if (error.code === 'auth/email-already-in-use') {
      setError("This email is already in use.");
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      setError("An account already exists with a different credential. Try logging in with that method.");
    } else if (error.code === 'auth/invalid-credential') {
      setError("Invalid credentials. Please try again.");
    } else {
      setError("An error occurred: " + error.message);
    }
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
            {error && <div className="text-red-500 mb-4 text-lg text-center">{error}</div>}
            {success && <div className="text-green-500 mb-4 text-lg text-center">{success}</div>}
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
