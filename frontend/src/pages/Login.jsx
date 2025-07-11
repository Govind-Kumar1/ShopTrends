import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setCartItems } = useContext(ShopContext); // 🔁 access to update cart

  const onSubmitHandler = async (event) => {
    event.preventDefault(); 

    try {
      let res;

      if (currentState === "Login") {
        // 🔐 LOGIN API
        res = await axios.post("http://localhost:5000/api/user/login", {
          email,
          password,
        }); 
        toast.success("Login Successful ✅");
      } else {
        // 📝 SIGNUP API
        res = await axios.post("http://localhost:5000/api/user/register", {
          name,
          email,
          password,
        });
        toast.success("Signup Successful 🎉");
      }

      const { token } = res.data;
      localStorage.setItem("token", token); // Save token

      // 🔁 FETCH USER CART DATA AFTER LOGIN
      const userRes = await axios.get("http://localhost:5000/api/user/userData", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { cartData } = userRes.data;
      setCartItems(cartData); // 🔁 Sync cart to frontend
      localStorage.setItem("cartItems", JSON.stringify(cartData)); // Optional: persist cart

      navigate("/");
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
        <p className="text-3xl prata-regular">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="hello@gmail.com"
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
        <p className="cursor-pointer">Forgot your password?</p>
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

      <button className="px-8 py-2 mt-4 font-light text-white bg-black">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
