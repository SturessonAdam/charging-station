import React, { useEffect, useState } from 'react'
import axios from "axios";

function BatteryHandler({ optimalhour }) {
    const [batterylife, setBatterylife] = useState(20) //batteriet startar alltid på 20
    const [charge, setCharge] = useState(false);
    const [resetCharge, setResetCharge] = useState(false);
    const [data, setData] = useState([]);

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
      const interval = setInterval(fetchData, 500);
      return () => clearInterval(interval);
      }, []);

    useEffect(() => {
        if (charge && batterylife >= 80) {
            console.log("det var denna som triggades")
            stopCharge();
        }
    }, [batterylife, charge]);

    useEffect(() => {
        const fetchData = () => {
          axios.get('http://127.0.0.1:5000/info')
            .then(response => {
              setData(response.data)
          })
          .catch(error => console.log(error));
      };
    
      fetchData();
    
      const interval = setInterval(fetchData, 500);
    
      return () => clearInterval(interval);
      }, []);

    useEffect(() => {
        const checkAndStartCharge = () => {
            const currentHour = data.sim_time_hour;
            const bestHours = Array.isArray(optimalhour) ? optimalhour.map(hour => hour.hour) : [];
    
            if (bestHours.includes(currentHour) && batterylife < 80 && !charge) {
                startCharge();
            } else if (!bestHours.includes(currentHour)) {
                stopCharge();
            }
        };
        
        const interval = setInterval(checkAndStartCharge, 500);
        return () => clearInterval(interval);
    }, [data, optimalhour, charge, batterylife]);


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
        {batterylife >= 80 ? (
        <p><strong>Battery is full</strong></p>
        ) : (
        <>
            <button onClick={startCharge} disabled={charge}>
            Start Charge
            </button>
            <button onClick={stopCharge} disabled={!charge}>
            Stop Charge
            </button>
        </>
        )}
        <button onClick={resetBattery}>
        Reset Server
        </button>
    </div>
  )
}

export default BatteryHandler;
