import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Protected = ({ Component }) => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  function checkAuth() {
    if (!localStorage.getItem("auth")) {
      navigate("/login");
    }

    fetch("http://localhost:8000/checkauth", {
      method: "POST",
      headers: {
        Authorization: "bearer " + localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        if (resp.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else if (resp.status === 500) {
          navigate("/login");
        }
      })
      .catch((e) => console.error(e));
  }

  return (
    <>
      <Component />
    </>
  );
};

export default Protected;
