/// ISUFIT SYSTEM

import axios from "axios";
const apiIsufit = axios.create({
  baseURL: "https://isufit-api.digitalprd.femi.com/api/values/",
});


const createHeaders = (token) => {
  return {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + token
    }
  }
};


function checkWorkerLogin(payload) {
  return apiIsufit.post(`/CheckWorkerLogin`, payload);
};


function getUserProjectsTree(payload) {
  return apiIsufit.post(`/GetUserProjectsTree`, payload);
};



function getWorkerAttendance(payload) {
  let token = localStorage.getItem("isufitToken")
  return apiIsufit.post(`/GetWorkerAttendance`, payload, createHeaders(token));
};


function getWorkHours(month) {
  // let currUser = JSON.parse(localStorage.getItem("currUser"))
  // let token = currUser.token
  // return api.get(`/reception/${coordsId}`, createHeaders(token));
}


const api = {
  checkWorkerLogin,
  getWorkHours,
  getUserProjectsTree,
  getWorkerAttendance
};

export default api;