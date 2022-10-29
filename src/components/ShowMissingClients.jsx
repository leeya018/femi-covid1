import React, { useEffect, useState } from 'react'

export default function ShowMissingClients({ contactInst, clientsAfterTest, allClienstFromInstitution }) {
  const [missing, setMissing] = useState([])
  const [missingListText, setMissingListText] = useState([])

  const [showData, setShowData] = useState(false)


  useEffect(() => {
    if (clientsAfterTest.length > 0 && allClienstFromInstitution.length > 0) {
      console.log("111111")
      console.log(clientsAfterTest)
      console.log(allClienstFromInstitution)
      console.log("111111")
    }
  }, [clientsAfterTest, allClienstFromInstitution])

  useEffect(() => {
    // showMissings()
  }, [])

  function showMissings() {
    setShowData(!showData)
    let missingList = allClienstFromInstitution.filter(client => !clientExists(clientsAfterTest, client))
    console.log("missings")
    console.log(missingList)
    setMissing(missingList)
    console.log("missings")


    let tempList = missingList.map(client => client.firstName + " " + client.lastName)

    setMissingListText(tempList)
  }

  function clientExists(clients, c) {
    return clients.find(client => client.idNum == c.idNum) !== undefined
  }


  function copyList() {
    navigator.clipboard.writeText(missingListText);
  }

  return (
    <div>
      <button onClick={showMissings}>who is missing</button>
      {showData && (
        <div>
          <div>
            <p>contact name : {contactInst.name}</p>
            <p>contact phone : {contactInst.phone}</p>
          </div>
          <button onClick={copyList}>copy list</button>
          <div>
            {
              missing.map(client => (
                  <div key={client.idNum}>
                    <span>{client.firstName + " " + client.lastName}</span>
                    <br />
                  </div>
                
              ))
            }
          </div>
        </div>
      )}


      {/* <h1>try </h1> */}

    </div>
  )
}
