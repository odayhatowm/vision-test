import Login from "./Pages/Login";
import Contacts from "./Pages/Contacts";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React from "react";

const App = () => {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

export default App;
