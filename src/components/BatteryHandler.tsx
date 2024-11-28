import React, { useEffect, useState } from 'react'
import axios from "axios";

function BatteryHandler() {
    const [batterylife, setBatterylife] = useState(20) //batteriet startar alltid på 20
    const [charge, setCharge] = useState(false);
    const [resetCharge, setResetCharge] = useState(false);

    //API anrop för att hämta batteri %
    useEffect(() => {
        const fetchData = () => {
          axios.get('http://127.0.0.1:5000/charge')
            .then(response => {
              setBatterylife(response.data)
          })
          .catch(error => console.log(error));
      };
      fetchData();
      const interval = setInterval(fetchData, 1000);
      return () => clearInterval(interval);
      }, []);

    useEffect(() => {
        if (charge && batterylife >= 80) {
            stopCharge();
        }
    }, [batterylife, charge]);

    //API anrop för att starta laddningen
    const startCharge = () => {
        axios.post('http://127.0.0.1:5000/charge', {
            "charging" : "on"
        })
            .then(() => {
                setCharge(true);
            })
            .catch(error => console.log(error));
    };

    const stopCharge = () => {
        axios.post('http://127.0.0.1:5000/charge', {
            "charging" : "off"
        })
            .then(() => {
                setCharge(false);
            })
            .catch(error => console.log(error));
    };

    const resetBattery = () => {
        axios.post('http://127.0.0.1:5000/discharge', {
            "discharging" : "on"
        })
            .then(() => {
                setResetCharge(true);
            })
            .catch(error => console.log(error));
    };

  return (
    <div>
        <p>State of charge: {batterylife}%</p>
        <button onClick={startCharge} disabled={charge}>
            Start Charge
        </button>
        <button onClick={stopCharge} disabled={!charge}>
            Stop Charge
        </button>
        <button onClick={resetBattery}>
            Reset Battery
        </button>
    </div>
  )
}

export default BatteryHandler;
