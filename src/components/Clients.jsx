// import "./otp.css";
import apis from "../api";
import React, { useEffect, useState } from "react";
import Client from "./Client";
import ShowMissingClients from "./ShowMissingClients";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { useHistory } from "react-router-dom";
// const coordsId = "de84c671-f59f-40d2-86f5-77dadd39d46a"  //oleg

// what are kind of clients are those
// status 1,0 - not done
// status 4,3,2 - inside system
export default function Clients({
  setTotalTests,
  contactInst,
  totalTests,
  allClienstFromInstitution,
}) {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [activeBtn, setActiveBtn] = useState(true);
  const [doneNum, setDoneNum] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [avgRate, setAvgRate] = useState(0);

  const [filter, setFilter] = useState("");

  let history = useHistory();

  useEffect(async () => {
    console.log("clients useUfect");

    let res;
    try {
      res = await apis.getClients(apis.coordsId);

      let clientList = res.data;
      clientList = sortByDate(clientList);
      console.log(clientList);
      setClients(clientList);
      setTotalTests(getLen());

      clientList = fliterMe(clientList);
      setFilteredClients(clientList);
      setDoneNum(clientList.length);
    } catch (error) {
      console.log(error.response);
    }
  }, []);

  function fliterMe(arr) {
    return arr.filter((client) => [2, 3, 4].includes(client.pcrStatus));
  }

  function sortByDate(arr) {
    let data = arr.sort(
      (a, b) =>
        Date.parse(b.receptionEnteredTime) - Date.parse(a.receptionEnteredTime)
    );
    return data;
  }
  function getLen() {
    return clients.filter((client) => [2, 3, 4].includes(client.pcrStatus))
      .length;
  }

  function filterByStatus(statusCodes) {
    // let winList = clients.length > 0 ? clients : clientList
    let filteredList = clients.filter((client) =>
      statusCodes.includes(client.pcrStatus)
    );
    setFilteredClients(filteredList);
    setDoneNum(filteredList.length);
  }

  // check what is the fast rate of samples in an hour
  function checkTestsRateFastTime() {
    let statusCodeGood = [2, 3, 4];
    let doneClientList = clients.filter((client) =>
      statusCodeGood.includes(client.pcrStatus)
    );
    let firstInd = 0;
    let secondInd = 59;
    let lim = 59;
    let bestTimeTmp = 1000;
    let startTime, endTime;
    if (doneNum < 60) {
      startTime = Date.parse(doneClientList[0].receptionEnteredTime);
      endTime = Date.parse(doneClientList[doneNum - 1].receptionEnteredTime);
      let deltaTime = getTime(startTime, endTime);
      bestTimeTmp = deltaTime;
    } else {
      for (firstInd; firstInd < doneNum - lim; firstInd += 1, secondInd += 1) {
        startTime = Date.parse(doneClientList[firstInd].receptionEnteredTime);
        endTime = Date.parse(doneClientList[secondInd].receptionEnteredTime);
        let time = getTime(startTime, endTime);
        if (time < bestTimeTmp) {
          bestTimeTmp = time;
        }
      }
    }

    setBestTime(parseInt(60 / bestTimeTmp));
  }

  // get 2 times and return the delta in hours
  function getTime(time1, time2) {
    var one_hour = 1000 * 60 * 60;
    let time = (time1 - time2) / one_hour;
    return time;
  }

  // get the avg rate of sample to the shift
  function avgRateCalc() {
    let statusCodeGood = [2, 3, 4];
    let doneClientList = clients.filter((client) =>
      statusCodeGood.includes(client.pcrStatus)
    );

    let startTime = Date.parse(doneClientList[0].receptionEnteredTime);
    let endTime = Date.parse(doneClientList[doneNum - 1].receptionEnteredTime);
    var one_hour = 1000 * 60 * 60;
    let shiftTime = (startTime - endTime) / one_hour;
    let avgRate = parseInt(doneNum / shiftTime);
    console.log(avgRate);
    setAvgRate(avgRate);
  }

  function calcTimes() {
    avgRateCalc();
    checkTestsRateFastTime();
  }

  function handleClick(statusCodes) {
    let newActive = statusCodes.includes(2) ? true : false;
    setActiveBtn(newActive);
    if (newActive !== activeBtn) {
      filterByStatus(statusCodes);
      let len = getLen();
      setTotalTests(len);
    }
  }

  function copyList() {
    let listToCopy = filteredClients.map(
      (client) => client.firstName + " " + client.lastName
    );
    navigator.clipboard.writeText(listToCopy);
  }

  return (
    <div>
      <div>
        {/* <button onClick={e => history.push("/showmissingclients")}> show missing clients</button><br /> */}

        <ShowMissingClients
          contactInst={contactInst}
          clientsAfterTest={filteredClients}
          allClienstFromInstitution={allClienstFromInstitution}
        />
        <button onClick={(e) => history.push("/monthlySalary")}>
          {" "}
          show monthlySalary
        </button>
        <br />
        <button onClick={calcTimes}> calc times </button>
        <label>fastest time: </label>
        <p>{bestTime} per hour </p>
        <label>avg fast time: </label>
        <p>{(bestTime / 60).toFixed()} samples per minute </p>

        <label>avg rate: </label>
        <p>{avgRate} samples per hour</p>
      </div>
      <div>
        <button onClick={(e) => history.push("/wage")}>wage calc</button>
      </div>
      <div>
        <button onClick={(e) => history.push("/coodlersPickup")}>
          coolers pickup
        </button>
      </div>

      <button onClick={(e) => history.push("/dashboard")} autoFocus>
        +
      </button>
      <div className="rows">
        <button onClick={copyList}>copy list</button>
      </div>
      <div className="rows">
        <button
          style={{ backgroundColor: activeBtn ? "blue" : "" }}
          onClick={() => handleClick([2, 3, 4])}
        >
          complete
        </button>
        <button
          style={{ backgroundColor: !activeBtn ? "blue" : "" }}
          onClick={() => handleClick([0, 1])}
        >
          not complete
        </button>
        <p>done : {doneNum}</p>
      </div>
      <div className="rows">
        <input
          type="text"
          placeholder="search"
          id="filter"
          name="filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <div className="rows">
        <div className="cols">
          {filteredClients
            .filter(
              (client) =>
                client.firstName.includes(filter) ||
                client.lastName.includes(filter) ||
                filter === ""
            )
            .map((client, key) => (
              <Client
                key={key}
                firstName={client.firstName}
                lastName={client.lastName}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
