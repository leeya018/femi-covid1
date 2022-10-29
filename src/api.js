import axios from "axios";
const api = axios.create({
  baseURL: "https://magenavot-be-prd.femimoh.co.il/femi-internal/1.0.0",
});

const createHeaders = (token) => {
  return {
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
};

export const otp = (payload) => {
  return api.post(`/otp`, payload);
};

export const login = (payload) => {
  return api.post(`/logIn`, payload);
};

// localStorage.getItem('jwtToken')
//  localStorage.setItem("jwtToken", 'Bearer ' + token);

// 749cfc59-5312-48c6-90ee-f422e692230f
// export const openTium = () => { //AKA plus button
//   let currUser = JSON.parse(localStorage.getItem("currUser"))
//   let token = currUser.token
//   return api.get(`/coordination/749cfc59-5312-48c6-90ee-f422e692230f`, createHeaders(token));

// };
export const createTium = (paylod) => {
  //AKA plus button
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;

  return api.post(`/coordination`, paylod, createHeaders(token));
};
export const findClient = (id, idType) => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(`/patients/${idType}/${id}/`, createHeaders(token));
};
const getPatientRoles = () => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(`/patientRoles/1`, createHeaders(token));

  // return api.get(`/lookup/patientRoles`, createHeaders(token));
};
// const getKupas = () => {
//   let currUser = JSON.parse(localStorage.getItem("currUser"))
//   let token = currUser.token
//   return api.get(`/lookup/kupas`, createHeaders(token));
// };
const getKupas = () => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(`/insurers`, createHeaders(token));
};
//

const getTaskById = () => {
  // should get a task id
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(
    `/tasks/5a5ffb39-f464-4efb-99a9-d72dc7f8c934`,
    createHeaders(token)
  );
};

const validateTube = (tubeNum) => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(
    `/validations/barcodes/test-tube/${tubeNum}`,
    createHeaders(token)
  );
};

const validateCooler = (coolerId) => {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.post(
    `/delivery/coolerBarcode?secondOnly=true`,
    {
      barcode: coolerId,
    },
    createHeaders(token)
  );
};
const validateIgum = (igumCode, coolerId) => {
  let WhatIsThat = "e395d04b-41d3-441d-849a-c4f091b64019";
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(
    `/validations/barcodes/pooling/${igumCode}?coolerBarcode=${coolerId}&excludeTestId=${WhatIsThat}`,
    createHeaders(token)
  );
};

const addRec = (data, addedData) => {
  let noIgumPayload = {
    source: data.source,
    exposeAbroad: false,
    closeContact: false,
    otherReason: false,
    cough: false,
    fever: false,
    otherBreathingSympt: false,
    symptStart: "1900-01-01",
    exposerCountry: "",
    leavingDate: "1900-01-01",
    otherReasonNotes: "",
    otherBreathingSymptNotes: "",
    testTubeBarCode: data.tubeId,
    containerBarCode: data.coolerId,
    tubeBarcode: data.tubeId,
    coolerBarcode: data.coolerId,
  };

  let payload = { ...noIgumPayload, ...addedData };
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.post(
    `/test/${data.source}?isDraft=false`,
    payload,
    createHeaders(token)
  );
};

async function getRole(roleNum) {
  let roles = (await getPatientRoles()).data;
  for (const role of roles) {
    if (role.id === roleNum) {
      return role;
    }
  }
  return null;
}

function getInstitutions() {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(`/lookup/institutes`, createHeaders(token));
}

async function getKupa(kupaId) {
  let kupas = (await getKupas()).data;
  for (const kupa of kupas) {
    if (kupa.id === kupaId) {
      return kupa;
    }
  }
  return null;
}

//bd8a3d31-dbd8-4685-9d6a-a9780f49b3d6
// function getCoordination(coordsId) {
//   let currUser = JSON.parse(localStorage.getItem("currUser"))
//   let token = currUser.token
//   return api.get(`/coordination/${coordsId}`, createHeaders(token));
// }

function getCoordination(coordsId) {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(`/reception/${coordsId}`, createHeaders(token));
}

function createTask(payload) {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.post(`/tasks`, payload, createHeaders(token));
}

function updateTask(payload) {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.put(`/tasks/${payload.source}`, payload, createHeaders(token));
}

// function getClients(coordsId) {
//   let currUser = JSON.parse(localStorage.getItem("currUser"))
//   let token = currUser.token
//   return api.get(`/tasks/coordination/${coordsId}`, createHeaders(token));

// };

function getClients(coordsId) {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  return api.get(`/tasks/reception/${coordsId}`, createHeaders(token));
}

function getAllReceptions() {
  let currUser = JSON.parse(localStorage.getItem("currUser"));
  let token = currUser.token;
  let myId = currUser.id;
  return api.get(`/users/${myId}/receptions`, createHeaders(token));
}

// const coordsId = "4062c1b8-3179-479c-baa9-34f01ce4fb42"; //or  רמת י
const coordsId = "4471a9b5-bb36-459a-80f6-97527c8c1c85"; //or  רמת י

const apis = {
  coordsId,
  otp,
  login,
  createTium,
  findClient,
  createTask,
  getTaskById,
  validateTube,
  validateCooler,
  addRec,
  getCoordination,
  getRole,
  getKupa,
  getClients,
  getInstitutions,
  validateIgum,
  getAllReceptions,
  getKupas,
  updateTask,
};

export default apis;
