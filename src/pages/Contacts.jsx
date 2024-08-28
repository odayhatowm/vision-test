import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "../environment/env";
import axiosInstance from "../environment/axiosConfig";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    const fetchContacts = async () => {
      try {
        const response = await axiosInstance.get('${base_url}/contact?total=true');
        setContacts(response.data);
      } catch (error) {
        if (error.response) {
          const errorCode = error.response.data.code;
          switch (errorCode) {
            case "0621":
              handleRefreshToken();
              break;
            case "0622":
            case "0623":
              handleInvalidOrExpiredRefreshToken();
              break;
            case "0601":
              navigate("/login");
              setError("Please log in to access this page.");
              break;
            default:
              setError("An unexpected error occurred.");
          }
        } else {
          setError("An error occurred while fetching contacts.");
        }
      }
    };

    const handleRefreshToken = async () => {
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${base_url}/auth/refresh-token`, { refreshToken });

        const { accessToken } = response.data.data;
        localStorage.setItem("accessToken", accessToken);

        fetchContacts();
      } catch (error) {
        if (error.response) {
          const errorCode = error.response.data.code;
          if (errorCode === "0622" || errorCode === "0623") {
            handleInvalidOrExpiredRefreshToken();
          } else {
            setError("An error occurred while refreshing the token.");
          }
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    const handleInvalidOrExpiredRefreshToken = () => {
      navigate("/login");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setError("Your session has expired. Please log in again.");
    };

    fetchContacts();
  }, [navigate]);

  return (
    <div>
      <h1>Contacts</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>{contact.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Contacts;