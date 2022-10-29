// import "./otp.css";
import React, { useState, useEffect, useRef } from "react";
import apis from "../api";
import { useHistory } from "react-router-dom";

const NUM_IN_IGUM = 15;
const NUM_IN_COOLER = 100;

export default function Tubes({
  disableCreate,
  updateDisableCreate,
  updateDisableFind,
  source,
  totalTests,
  setTotalTests,
  clearAddClientFields,
  clientId,
  withIgum,
}) {
  let history = useHistory();
  const inputCooler = useRef(null);
  const buttonRef = useRef(null);

  const [tubeId, setTubeId] = useState("");
  const [coolerId, setCoolerId] = useState("");
  const [igumId, setIgumId] = useState("");
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabledIgum, setIsDisabledIgum] = useState(false);

  useEffect(() => {
    setCoolerId(localStorage.getItem("coolerId"));
    setIgumId(localStorage.getItem("igumId"));
    checkDisableFields();
    console.log("useEffect Tubes");
  }, []);

  useEffect(() => {
    updateLocalStorage();
    console.log("total use effect");
  }, [totalTests]);

  function checkDisableFields() {
    if (totalTests % NUM_IN_COOLER == 0) {
      localStorage.setItem("coolerId", "");
      setCoolerId("");
    }
    if (localStorage.getItem("coolerId") !== "") {
      setIsDisabled(true);
    }
    if ((totalTests % 100) % NUM_IN_IGUM == 0) {
      localStorage.setItem("igumId", "");
      setIgumId("");
    }
    if (localStorage.getItem("igumId") !== "") {
      setIsDisabledIgum(true);
    }
  }

  async function validateTube(tubeId) {
    if (tubeId.substring(0, 1) !== "3") {
      setMessage("tube not start with 3");
      return false;
    }
    let res = await apis.validateTube(tubeId);
    if (res.data == true) return true;
    setMessage("tube err");
    return false;
  }

  async function validateCooler(coolerId) {
    let res;
    try {
      res = await apis.validateCooler(coolerId);
      if (res.data.coolerStatus.id == 2) {
        return true;
      } else {
        let { id, title } = res.data.coolerStatus;
        setMessage("status code of cooler is :" + id + " : " + title);
      }
    } catch (error) {
      console.log(error);
      setMessage(error.message);
      return false;
    }
  }

  async function validateIgum() {
    let res = await apis.validateIgum(igumId, coolerId);
    if (res.status == 204) {
      return true;
    }
    setMessage("igum err");
    return false;
  }

  function saveIdBeforeCrash() {
    localStorage.setItem("clientId", clientId);
  }

  function removeIdAfterSuccess() {
    localStorage.removeItem("clientId");
  }

  async function addRec() {
    updateDisableCreate(true);
    console.log("hola add rec");
    let data = {
      source,
      tubeId,
      coolerId,
      igumId,
    };

    let igumAdditionFieldes = {
      poolingType: 2,
      poolingComplete: 1,
      poolingSampleBarcode: data.igumId,
    };

    try {
      if (await validateTube(tubeId)) {
        if (await validateCooler(coolerId)) {
          //status 200
          if (withIgum) {
            if (await validateIgum(igumId, coolerId)) {
              sendRecord(data, igumAdditionFieldes); // with igum
            }
          } else {
            sendRecord(data, {}); // no igum
          }
        }
      }
    } catch (err) {
      saveIdBeforeCrash();
      setMessage(err.response.data.message);
    }
  }

  async function sendRecord(data, addedData) {
    let res = await apis.addRec(data, addedData);
    if (res.status === 200) {
      console.log("finish good");
      setTotalTests(totalTests + 1);
      clearFields();
      removeIdAfterSuccess();
      updateDisableFind(false);
      updateDisableCreate(false);
    } else {
      saveIdBeforeCrash();
      setMessage(res.status);
    }
  }

  function updateLocalStorage() {
    if ((totalTests % 100) % NUM_IN_IGUM == 0) {
      localStorage.setItem("igumId", "");
    }
    if (totalTests % NUM_IN_COOLER == 0) {
      localStorage.setItem("coolerId", "");
    }
  }

  function clearFields() {
    setTubeId("");
    setMessage("");
    clearAddClientFields();
  }

  function handleChangeCooler(e) {
    setMessage("");
    setCoolerId(e.target.value);
    localStorage.setItem("coolerId", e.target.value);
  }

  function resetIgumNum() {
    setIgumId("");
    localStorage.setItem("igumId", "");
    setIsDisabledIgum(false);
  }

  function handleChangeIgum(e) {
    setMessage("");
    setIgumId(e.target.value);
    localStorage.setItem("igumId", e.target.value);
  }

  return (
    <div>
      <button onClick={resetIgumNum}>reset igum</button>
      <div className="cols">
        <input
          type="text"
          autoFocus
          placeholder="tubeId"
          maxLength="9"
          onChange={(e) => {
            setTubeId(e.target.value);
            setMessage("");
          }}
        />
        <div className="no-margin rows">
          <input
            className="no-margin"
            ref={inputCooler}
            type="text"
            disabled={isDisabled}
            placeholder="coolerId"
            maxLength="11"
            onChange={handleChangeCooler}
            value={coolerId}
          />
          <p className="no-margin">({totalTests % NUM_IN_COOLER})</p>
        </div>
        {withIgum && (
          <div className="no-margin rows">
            <input
              className="no-margin"
              type="text"
              placeholder="igumId"
              disabled={isDisabledIgum}
              maxLength="9"
              onChange={handleChangeIgum}
              value={igumId}
            />
            <p className="no-margin">({totalTests % NUM_IN_IGUM})</p>
            <br />
          </div>
        )}
        <button
          className={` ${disableCreate ? "button_disable" : "button_enable"}`}
          disabled={disableCreate}
          onClick={addRec}
        >
          add client
        </button>
        <p className="err-message">{message}</p>
      </div>
    </div>
  );
}
