import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const boolval = localStorage.getItem("is_admin") === "true";
  console.log("auth", localStorage.getItem("auth"));


  function handleClick() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div className="flex w-full lg:full h-12 lg:h-8 fixed backdrop-blur-sm shadow-lg justify-between items-center">
      <div className="pl-8 font-bold text-indigo-700 italic">LLM ChatBot</div>
      <div className="flex pr-6 gap-x-4">
        {!localStorage.getItem("auth") ? (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/register'>Signup</Link>
          </>
        ) : (
          <>
            {boolval && (
              <button onClick={() => navigate("/user")}>AllUser</button>
            )}
            <button onClick={() => handleClick()}>logout</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
