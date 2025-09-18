import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const { token, setToken, backendUrl } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          password,
          email,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form onSubmit={handleOnSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <h1 className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h1>
        <p className="">
          Please {state === "Sign Up" ? "Create Account" : "Login"} to book
          appointment
        </p>
        {state === "Sign Up" ? (
          <div className="w-full">
            <p>Full Name</p>
            <input
              placeholder="Please Enter your Full name"
              onChange={(event) => setName(event.target.value)}
              type="text"
              value={name}
              required
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
            />{" "}
          </div>
        ) : null}
        <div className="w-full">
          <p>Email</p>
          <input
            placeholder="Please Enter your Email"
            type="email"
            id="email"
            onChange={(event) => setEmail(event.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            placeholder="Please Enter your Password"
            type="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 my-2 rounded-md text-base"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>
        {state === "Sign Up" ? (
          <p>
            Already have an account ?{" "}
            <span
              onClick={() => setState("Login")}
              className="cursor-pointer text-primary-900 font-semibold"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="cursor-pointer text-primary-900 font-semibold"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
