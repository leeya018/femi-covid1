import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Otp from "./components/Otp";
import Login from "./components/Login";
import Dashbaord from "./components/Dashbaord";
import Clients from "./components/Clients";
import MonthlySalary from "./components/MonthlySalary";
import api from "./api";
import Wage from "./components/Wage";
import Xlsx from "./components/Xlsx";
import CoodlersPickup from "./components/CoodlersPickup";
import ExportCSV from "./components/ExportCSV";

function App() {
  const [idNum, setIdNum] = useState(process.env.REACT_APP_URER_ID);
  const [phone, setPhone] = useState(process.env.REACT_APP_USER_PHONE);
  const [loggedIn, setLoggedIn] = useState(false);
  const [totalTests, setTotalTests] = useState(0);
  const [instName, setInstName] = useState("");
  const [allClienstFromInstitution, setAllClienstFromInstitution] = useState(
    []
  );
  const [isXlsz, setIsXlsz] = useState(false);
  const [contactInst, setContactInst] = useState({});
  const [clientsData, setClientsData] = useState();

  useEffect(async () => {
    let res, clientList, len;
    if (localStorage.getItem("currUser")) {
      res = await api.getClients(api.coordsId);
      clientList = res.data;
      console.log(clientList);
      len = clientList.filter((client) =>
        [2, 3, 4].includes(client.pcrStatus)
      ).length;
      setTotalTests(len);
      if (!isXlsz) {
        getAllClientFromTium(); // all tiums
      } // else its gonna take from excel
      // getAllClientsFromOneTium()  // one tiums
    }
    console.log("app useEfect");
  }, []);

  async function getAllClientFromTium() {
    // let institutionName = (await api.getCoordination(api.coordsId)).data.institute.name
    let data = (await api.getCoordination(api.coordsId)).data;
    // let data = (await api.getCoordination("cafd217c-c166-4e9e-9f57-eab175c01c45")).data   //REMOVE THIS ONE

    let institutionName = data.institute.name;
    setInstName(institutionName);

    setContactInst({
      name: data.institute.contactName,
      phone: data.institute.contactPhone,
    });
    let res = await api.getAllReceptions();
    let receptions = res.data;

    let recetionWithSameName = receptions.filter(
      (rec) => rec.institute.name === institutionName
    );
    let receptionIds = recetionWithSameName.map((rec) => rec.id);
    console.log(receptionIds);
    let arrOfAllClientsFromInst = [];

    receptionIds.map(async function (coordId) {
      let clientsFull = (await api.getClients(coordId)).data;
      let clients = clientsFull.map(function (client) {
        let { firstName, lastName, idType, idNum } = client;
        return {
          firstName,
          lastName,
          idType,
          idNum,
          label: firstName + " " + lastName,
        };
      });

      arrOfAllClientsFromInst = arrOfAllClientsFromInst
        .concat(clients)
        .filter(function (c) {
          return this[c.idNum] ? false : (this[c.idNum] = true);
        }, {});

      setAllClienstFromInstitution(arrOfAllClientsFromInst);
      setClientsData(arrOfAllClientsFromInst);
    });
    console.log("I am out");
  }

  async function getAllClientsFromOneTium() {
    let SIUDIT_GAN_BAIR_COORDS = "0c78605c-2908-4b74-9ae9-e7050824595e";

    let institutionName = (await api.getCoordination(api.coordsId)).data
      .institute.name;
    setInstName(institutionName);

    let clientsFull = (await api.getClients(SIUDIT_GAN_BAIR_COORDS)).data;
    let clients = clientsFull.map(function (client) {
      let { firstName, lastName, idType, idNum } = client;
      return {
        firstName,
        lastName,
        idType,
        idNum,
        label: firstName + " " + lastName,
      };
    });

    setAllClienstFromInstitution(clients);
  }

  // 0c78605c-2908-4b74-9ae9-e7050824595e  -  גן בעיר סיעודית

  const childProps = {
    idNum,
    phone,
    setIdNum,
    setPhone,
  };

  return (
    <div>
      <div className="left">
        <Xlsx
          updateAllClienstFromInstitution={setAllClienstFromInstitution}
          updateIsXlsz={setIsXlsz}
        ></Xlsx>
        <ExportCSV csvData={clientsData} fileName={instName} />
      </div>
      <Router>
        <Switch>
          <Route exact path="/">
            {loggedIn ? <Redirect to="/dashboard" /> : <Otp {...childProps} />}
          </Route>

          <Route path="/dashboard">
            <Dashbaord
              instName={instName}
              allClienstFromInstitution={allClienstFromInstitution}
              totalTests={totalTests}
              setTotalTests={setTotalTests}
            />
          </Route>

          <Route path="/wage">
            <Wage />
          </Route>

          <Route path="/coodlersPickup">
            <CoodlersPickup />
          </Route>

          <Route path="/login">
            <Login idNum={idNum} phone={phone} />
          </Route>
          <Route path="/clients">
            <Clients
              setTotalTests={setTotalTests}
              contactInst={contactInst}
              totalTests={totalTests}
              allClienstFromInstitution={allClienstFromInstitution}
            />
          </Route>

          <Route path="/monthlySalary">
            <MonthlySalary />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
