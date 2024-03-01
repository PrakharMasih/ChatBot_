import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import LoginPage from "./components/LoginPage";
import Home from "./components/Home";
import AllUser from "./components/AllUser";
import Navbar from "./components/Navbar";
import Protected from "./components/Protected";

function App() {
  return (
    <>
      <BrowserRouter>
         <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Protected Component={Home} />} />
          <Route path="/user" element={<Protected Component={AllUser} />} />
          <Route path="*" element="404 Page Not Found" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
