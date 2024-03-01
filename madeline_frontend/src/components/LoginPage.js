import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onsubmit = (data) => {
    axios
      .post(
        "http://localhost:8000/login",
        new URLSearchParams({
          username: data.username,
          password: data.password,
        })
      )
      .then(function (response) {
        if (response.data.access_token) {
          const user = jwtDecode(response.data.access_token);
          localStorage.setItem("username", user.user);
          localStorage.setItem("is_admin", user.admin);
          localStorage.setItem("auth", response.data.access_token);
          navigation("/");
        }
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center bg-stone-100">
        <form
          className="flex flex-col border p-10 pl-14 pr-14 rounded-3xl shadow-2xl"
          onSubmit={handleSubmit(onsubmit)}
        >
          <h1 className="text-2xl font-semibold self-center mb-4">Login</h1>
          <span className="flex flex-col h-20">
            <label htmlFor="username">Username</label>
            <input
              className="border border-gray-400 pl-1 shadow-inner rounded-lg focus:border-blue-500 focus:ring-1 focus:outline-none"
              type="text"
              id="username"
              {...register("username", { required: true })}
            />
            {errors.username && (
              <p className="text-xs text-red-600 pl-2">
                {" "}
                Username is required *
              </p>
            )}
          </span>

          <span className="flex flex-col h-20">
            <label htmlFor="password">Password</label>
            <input
              className="border border-gray-400 pl-1 shadow-inner rounded-lg focus:border-blue-500 focus:ring-1 focus:outline-none"
              type="password"
              id="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <p className="text-sm text-red-600">Password is required</p>
            )}
          </span>

          <button
            className="border border-blue-400 hover:ring-2 hover:bg-blue-400 bg-blue-300 w-1/2 self-center rounded-xl"
            type="submit"
          >
            Login
          </button>

          <p className="text-sm self-center mt-1 font-semibold">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
