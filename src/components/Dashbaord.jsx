// import "./otp.css";
import api from "../api";
import React, { useState, useEffect } from "react";
import AddClient from "./AddClient";
import { useHistory } from "react-router-dom";
import "../style.css";

export default function Dashbaord({
  allClienstFromInstitution,
  instName,
  totalTests,
  setTotalTests,
}) {
  let history = useHistory();

  useEffect(async () => {
    console.log("dash useUfect");
    let res, clientList, len;
    if (localStorage.getItem("currUser")) {
      res = await api.getClients(api.coordsId);
      clientList = res.data;
      console.log(clientList);
      len = clientList.filter((client) =>
        [2, 3, 4].includes(client.pcrStatus)
      ).length;
      setTotalTests(len);
    }
    // res = await api.getCoordination(api.coordsId)
    // setInstName(res.data.institute.name)

    console.log("dash useEfect");
  }, []);

  return (
    <div className="otp-wrapper">
      <button onClick={(e) => history.push("/clients")}>client list</button>
      <h2>{instName}</h2>
      <AddClient
        allClienstFromInstitution={allClienstFromInstitution}
        totalTests={totalTests}
        instName={instName}
        setTotalTests={setTotalTests}
      ></AddClient>
    </div>
  );
}
