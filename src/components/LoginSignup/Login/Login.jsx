import React, { useState } from "react";
import { auth, googleProvider, facebookProvider } from "../../../config/Firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { SiGmail } from "react-icons/si";
import { FaFacebook } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import '../../../App.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setSuccess("Logged in Successfully - redirecting right now");
      navigate(`/dashboard/${result.user.uid}`);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleFacebookLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      setSuccess("Logged in Successfully - redirecting right now");
      navigate(`/dashboard/${result.user.uid}`);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Logged in Successfully - redirecting right now");
      navigate(`/dashboard/${userCredential.user.uid}`);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    setSuccess("");
    switch (error.code) {
      case 'auth/invalid-credential':
        setError("Invalid email or password.");
        break;
      case 'auth/user-disabled':
        setError("This user has been disabled.");
        break;
      case 'auth/user-not-found':
        setError("No user found with this email.");
        break;
      case 'auth/wrong-password':
        setError("Incorrect password.");
        break;
      default:
        setError("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="bg-image">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-image">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
          <div className="flex justify-center mb-2">
            <div className="icon-circle" onClick={handleGoogleLogin}>
              <SiGmail size={30} />
            </div>
            <div className="icon-circle" onClick={handleFacebookLogin}>
              <FaFacebook size={30} />
            </div>
          </div>
          <div className="flex flex-row justify-center mb-4">
            <p>or with:</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter your email"
                value={email}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-row justify-center gap-4">
              <button
                type="submit"
                className="w-1/3 bg-blue-500 text-white p-2 mt-4 hover:bg-blue-600 rounded-3xl"
              >
                LOGIN
              </button>
            </div>
            <div className="flex flex-row justify-center text-center mb-2">
              <p>
                New here?{" "}
                <span className="text-blue-600">
                  <Link to="/signup">Sign up now!</Link>
                </span>
              </p>
            </div>
            {error && <div className="text-red-500 mb-4 text-lg text-center">{error}</div>}
            {success && <div className="text-green-500 mb-4 text-lg text-center">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
