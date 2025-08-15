import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../slices/features/userSlice";
import { fetchCart } from "../slices/features/cartSlice";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === "Login") {
        // --- 🔐 LOGIN ---
        const response = await axios.post(
          `${API}/api/user/login`,
          { email, password },
          { withCredentials: true } 
        );

        if (response.data.success && response.data.token) {
          const newToken = response.data.token; // ✅ Store token in a variable
          dispatch(setToken(newToken));
          dispatch(fetchCart(newToken)); // ✅ Pass the new token directly

          toast.success("Login Successful ✅");
          navigate("/");
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      } else {
        // --- 📝 SIGNUP ---
        const response = await axios.post(
          `${API}/api/user/register`,
          { name, email, password },
          { withCredentials: true }
        );

        if (response.data.success && response.data.token) {
          const newToken = response.data.token; // ✅ Store token in a variable
          dispatch(setToken(newToken));
          dispatch(fetchCart(newToken)); // ✅ Pass the new token directly

          toast.success("Signup Successful 🎉");
          navigate("/");
        } else {
          toast.error(response.data.message || "Signup failed.");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mt-10 mb-2">
        <p className="text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex justify-between w-full text-sm mt-[-8px]">
        {currentState === "Login" ? (
          <p className="cursor-pointer">Forgot your password?</p>
        ) : (
          <span></span>
        )}
        <p
          className="cursor-pointer underline"
          onClick={() =>
            setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
          }
        >
          {currentState === "Login"
            ? "Create a new account"
            : "Already have an account? Login"}
        </p>
      </div>

      <button
        type="submit"
        className="px-8 py-2 mt-4 font-light text-white bg-black"
      >
        {currentState}
      </button>
    </form>
  );
};

export default Login;