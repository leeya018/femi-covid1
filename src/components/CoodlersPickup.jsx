import React, { useState, useEffect } from 'react'
import apis from '../api'
import { useHistory } from "react-router-dom";


export default function CoodlersPickup() {

    const [instCollect, setInstCollect] = useState([])
    const [instNotCollect, setInstNotCollect] = useState([])

    let history = useHistory();

    useEffect(async () => {
        let myReceptionsFromToday = await getMyReceptionsFromToday()
        checkCoolersStatus(myReceptionsFromToday)

    }, [])


    async function getMyReceptionsFromToday() {
        let myReceptions = (await apis.getAllReceptions()).data
        // console.log(myReceptions)

        let today = new Date()
        let myReceptionsFromToday = []

        for (const rec of myReceptions) {
            if (new Date(rec.createdDate).getDate() === today.getDate()) {
                myReceptionsFromToday.push(rec)
            } else {
                break
            }
        }

        return myReceptionsFromToday
    }


    async function checkCoolersStatus(arrOfRecs) {
        let instCollectT = []
        let instNotCollectT = []

        for (const rec of arrOfRecs) {
            let clientsInRec = (await apis.getClients(rec.id)).data
            let foundClient = clientsInRec.find(client => client.pcrStatus === 3)
            if (foundClient) {
                instCollectT.push(rec.institute.name)
            } else {
                instNotCollectT.push(rec.institute.name)
            }
        }

        setInstCollect(instCollectT)
        setInstNotCollect(instNotCollectT)

    }
    return (
        <div>
             <button onClick={e => history.push("/clients")} >go back</button>
            <h2>CoodlersPickup</h2>
            <h4>collect</h4>
            <ul>
                {
                    instCollect.map(inst =>
                        <li>{inst}</li>)
                }
            </ul>
            <h4>not collect</h4>
            <ul>
                {
                    instNotCollect.map(inst =>
                        <li>{inst}</li>)
                }
            </ul>
        </div>
    )
}
