// import './otp.css';
import apis from "../api";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function Otp({ idNum, phone, setIdNum, setPhone }) {
  let history = useHistory();
  const [message, setMessage] = useState("");

  function otp(e) {
    apis
      .otp({ idNum, phone })
      .then((res) => {
        console.log(res.data);
        setMessage("");
        history.push("/login");
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
      <h1>Please Log In</h1>
      <div>
        {/* <button onClick={()=>history.push('/test')}>camera</button> */}
        <label>
          <p>id</p>
          <input
            type="text"
            placeholder="setIdNum"
            onChange={(e) => setIdNum(e.target.value)}
          />
        </label>
        <label>
          <p>phone</p>
          <input
            type="text"
            placeholder="phone"
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <div>
          <button onClick={otp}>Submit</button>
        </div>
        <span className="err-message">{message}</span>
      </div>
    </div>
  );
}
