import React, { useEffect, useState } from "react";

const AllUser = () => {
  const [tableVal, setTableVal] = useState([]);
  useEffect(() => {
    getAllUser();
  }, []);

  function getAllUser() {
    fetch("http://localhost:8000/alluser", {
      headers: {
        Authorization: "bearer " + localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
    })
      .then((resdata) => resdata.json())
      .then((resp) => setTableVal(resp))
      .catch((e) => console.error(e));
  }

  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <table class=" table-auto w-full lg:table-fixed  border text-center lg:w-4/5">
          <thead className="border">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>is_Admin</th>
            </tr>
          </thead>
          <tbody>
            {tableVal.length &&
              tableVal.map(({ id, username, email, is_admin }) => {
                return (
                  <tr className="border">
                    <td>{id}</td>
                    <td>{username}</td>
                    <td>{email}</td>
                    <td>{`${is_admin}`}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AllUser;
