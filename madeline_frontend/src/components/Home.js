import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [question, setQuestion] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    getConversations();
  }, []);

  function getConversations() {
    fetch("http://localhost:8000/conversation", {
      method: "get",
      headers: new Headers({
        Authorization: "bearer " + localStorage.getItem("auth"),
        "Content-Type": "application/json",
      }),
    })
      .then((resdata) => resdata.json())
      .then((resp) => {
        setChats(resp);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function handleSubmit() {
    const url = "http://localhost:8000/conversation/";
    const requestUrl = `${url}?query=${encodeURIComponent(question)}`;
    fetch(requestUrl, {
      method: "POST",
      headers: {
        // Accept: "application/json",
        Authorization: "bearer " + localStorage.getItem("auth"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.clear();
          navigation("/login");
        }
      })
      .then(() => {
        getConversations();
        setQuestion("");
      })
      .catch((e) => console.error(e));
  }

  return (
    <>
      <div className="flex w-full h-screen  bg-gray-200 justify-center">
        <div className="flex flex-col w-full lg:w-4/5  bg-gray-100 justify-end shadow-2xl">
          <div className="w-full overflow-y-auto mb-3">
            <div className="w-4/5 ml-2 bg-indigo-300 p-1 rounded-xl pl-4 pr-4 ">
              Hello {localStorage.getItem("username")}! How can I assist you
              today?
            </div>
            {chats.length &&
              chats.map(({ query, response, id }) => {
                return (
                  <span key={id}>
                    {query && (
                      <div className="flex flex-col w-full mb-2  items-end flex-wrap">
                        <span className=" w-3/5 text-end  mr-2">
                          <span className="bg-indigo-300 p-1 rounded-xl pl-4 pr-4">
                            {query}
                          </span>
                        </span>
                      </div>
                    )}
                    {response && (
                      <div className="w-4/5 ml-2 bg-indigo-300 mb-2 p-1 rounded-xl pl-4 pr-4 ">
                        {response}
                      </div>
                    )}
                  </span>
                );
              })}
          </div>
          <input
            className="w-full border border-gray-500 mb-2 rounded-3xl h-10 pl-5 shadow-inner "
            placeholder="Ask your Query here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
