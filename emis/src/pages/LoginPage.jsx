import React, { useContext, useState } from "react";
import { FiLock, FiMail, FiEye, FiEyeOff } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/nsc_logo.png";
import bgImage from "../assets/login_bg-01.png";
import footerImage from "../assets/login-01.png";
import LoadingGif from "../assets/loading-gif.gif";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  async function onSubmit(e) {
    setLoading(true);
    e.preventDefault();
    await handleLogin(email, password);
    setLoading(false);
  }

  return (
    <div className="h-screen flex">
      <div
        className="w-1/2 bg-cover bg-center  justify-center items-center relative hidden lg:flex"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute top-36 left-12 text-white text-4xl font-bold">
          Welcome to EMIS
        </div>
        <div className="absolute top-52 left-12 text-white text-lg">
          Experience College Like Never Before—Our App Makes It Easy to Stay
          <br></br>
          Informed, Connected, and Engaged!
        </div>

        <img
          src={footerImage}
          alt="EMIS illustration"
          className="absolute bottom-1 left-28 w-full h-auto"
        />
      </div>

      {/* Right Section: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 mix-blend-plus-darker bg-no-repeat bg-cover " style={{ backgroundImage: `url(${bgImage})`, backgroundPosition:"center", }}>
        <h2 className="text-3xl font-bold text-white  lg:text-gray-800 mb-6 text-center ">
          Sign In to EMIS
        </h2>

        <form onSubmit={onSubmit} className="space-y-6 w-full max-w-md">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-white lg:text-gray-600 mb-1"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3 text-gray-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-12 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-white lg: text-gray-600 mb-1"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-500 cursor-pointer"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex justify-center items-center"
          >
            {loading ? (
              <img src={LoadingGif} alt="loading" className="w-6 h-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
