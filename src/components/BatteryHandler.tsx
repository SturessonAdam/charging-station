import React, { useEffect, useState } from 'react'
import axios from "axios";

function BatteryHandler() {
    const [batterylife, setBatterylife] = useState(null)
    const [charge, setCharge] = useState(false);

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

    const startCharge = () => {
        axios.post('http://127.0.0.1:5000/charge', {
            "charging" : "on"
        })
            .then(() => {
                setCharge(true);
            })
            .catch(error => console.log(error));
    };

  return (
    <div>
        <p>State of charge: {batterylife}%</p>
        <button onClick={startCharge} disabled={charge}>
            Start Charge
        </button>
    </div>
  )
}

export default BatteryHandler;
