import React from 'react';
import { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

const BONUS_PER_MOVE = 40
const SAMPLE_RATE = 3
const HOUR_RATE = 29


export default function Wage() {
    const [sum, setSum] = useState(0)
    const [instBonus, setInstBonus] = useState(0)
    const [sampleBonus, setSampleBonus] = useState(0)
    const [hours, setHours] = useState(0)
    const [hourWage, setHourWage] = useState(0)
    const [avgRatePerHour, setAvgRatePerHour] = useState(0)

    let history = useHistory();

    useEffect(() => {
        let total = instBonus + sampleBonus + hourWage
        setSum(total)
        setAvgRatePerHour((total / hours).toFixed(0))
    }, [instBonus, sampleBonus, hourWage]);


    function updateBonusInst(e) {
        let numInts = e.target.value || 1
        let moves = numInts - 1
        setInstBonus(moves * BONUS_PER_MOVE)
    }


    function updateSamplesBonus(e) {
        let samples = e.target.value || 0
        setSampleBonus(samples * SAMPLE_RATE)
    }


    function updateHoursBonus(e) {
        let hours = e.target.value || 0
        setHours(hours)
        setHourWage(hours * HOUR_RATE)
    }


    return <div>
        <button onClick={e => history.push("/clients")} >go back</button>
        <h2>daily wage:</h2>
        <label>inst num<input type="num" onChange={updateBonusInst} /></label><br />
        <label>amount samples<input type="num" onChange={updateSamplesBonus} /></label><br />
        <label>hours<input type="num" onChange={updateHoursBonus} /></label><br />
        <p>wage : {sum} shekels</p>
        <p>avg wage per hour : {avgRatePerHour || 0} shekels</p>

    </div>;
}
