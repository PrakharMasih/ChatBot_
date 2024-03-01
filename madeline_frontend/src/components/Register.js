import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const naviagtion = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onsubmit = (data) => {
    const { password, re_password } = data;
    if (password !== re_password) {
      alert("Password does not match");
      return;
    }
    console.log(data);

    fetch("http://localhost:8000/register/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    })
      .then((resp) => resp.json())
      .then((resdata) => {
        if (resdata.detail) {
          alert(resdata.detail);
          naviagtion("/login");
          return;
        }
        alert("User registered Successfully");
        naviagtion("/login");
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className="flex w-full h-screen justify-center items-center bg-stone-100">
        <form
          className="flex flex-col border p-14 pt-8 pb-8 rounded-3xl shadow-2xl"
          onSubmit={handleSubmit(onsubmit)}
        >
          <h1 className="text-2xl font-semibold self-center mb-4">Signup</h1>
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
            <label htmlFor="email">Email</label>
            <input
              className="border border-gray-400 pl-1 shadow-inner rounded-lg focus:border-blue-500 focus:ring-1 focus:outline-none"
              type="email"
              id="email"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-600 pl-2"> Email is required *</p>
            )}
          </span>

          <span className="flex flex-col h-20">
            <label htmlFor="password">Password</label>
            <input
              className="border border-gray-400 pl-1 shadow-inner rounded-lg focus:border-blue-500 focus:ring-1 focus:outline-none"
              type="password"
              id="password"
              {...register("password", {
                required: true,
                pattern: {
                  value:
                    "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$",
                  message: "invalid  password",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-600 pl-2">
                {" "}
                Password is required *
              </p>
            )}
          </span>

          <span className="flex flex-col h-20">
            <label htmlFor="re_password">ReType-Password</label>
            <input
              className="border border-gray-400 pl-1 shadow-inner rounded-lg focus:border-blue-500 focus:ring-1 focus:outline-none"
              type="password"
              id="re_password"
              {...register("re_password", { required: true })}
            />
            {errors.re_password && (
              <p className="text-sm text-red-600 pl-2">
                {" "}
                Password is required *
              </p>
            )}
          </span>

          <button
            className="border border-blue-400 hover:ring-2 hover:bg-blue-400 bg-blue-300 w-1/2 self-center rounded-xl"
            type="submit"
          >
            Signup
          </button>
          <p className="text-sm self-center mt-1 font-semibold">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
