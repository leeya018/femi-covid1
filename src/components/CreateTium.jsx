import React, { useEffect, useState } from "react";
import apis from "../api";
// import './otp.css';
import { useHistory } from "react-router-dom";

export default function CreateTium() {
  let history = useHistory();

  const [institutions, setInstitutions] = useState([]);
  const [instName, setInstName] = useState("");

  useEffect(async () => {
    let res;
    try {
      res = await apis.getInstitutions();
      setInstitutions(res.data);
      console.log(res.data);
      console.log(typeof res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  function getOptions() {
    // let data = institutions
    // .filter(inst => instName === '' || inst.instituteName.includes(instName))
    // .map((inst, index) => <option key={index} value={inst.instituteName}>{inst.instituteName}</option>);
    // console.log("11")
    // console.log(data)
    //  return institutions
    //     .filter(inst => instName === '' || inst.instituteName.includes(instName))
    //     .map((inst, index) => <option key={index} value={inst.instituteName}>{inst.instituteName}</option>);
  }

  return (
    <div className="otp-wrapper">
      <button onClick={() => history.push("/dashboard")}>add client</button>
      <input type="text" onChange={(e) => setInstName(e.target.value)} />
      <div>tnirntinrsietnsir</div>
      <select id="inst" name="inst">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        {getOptions()}
      </select>
    </div>
  );
}
