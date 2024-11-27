import React, { useEffect, useState } from 'react'
import axios from "axios";

function BatteryHandler() {
    const [batterylife, setBatterylife] = useState(null)

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

  return (
    <div>
        <p>State of charge: {batterylife}%</p>
    </div>
  )
}

export default BatteryHandler;
