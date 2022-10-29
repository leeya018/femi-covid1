// import './otp.css';
import apis from "../api";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Login({ idNum, phone }) {
  let history = useHistory();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  function login(e) {
    let payload = {
      idNum,
      otp,
      phone,
    };
    apis
      .login(payload)
      .then((res) => {
        if (res.status !== 200) {
          setMessage("error");
        } else {
          setMessage("");
          localStorage.setItem("currUser", JSON.stringify(res.data));
          history.push("/dashboard");
          console.log(res.data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          console.log(err.response.data.message);
          setMessage(err.response.data.message);
        }
      });
  }

  return (
    <div className="otp-wrapper">
      <h1> Please Log In</h1>
      <input
        type="text"
        autoFocus
        placeholder="setOtp"
        maxLength="6"
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={login}>Submit</button>
      <span className="err-message">{message}</span>
    </div>
  );
}
