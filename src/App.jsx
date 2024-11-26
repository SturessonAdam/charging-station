import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import BatteryHandler from './components/batteryHandler'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://127.0.0.1:5000/info')
        .then(response => {
          setData(response.data)
      })
      .catch(error => console.log(error));
  };

  fetchData();

  const interval = setInterval(fetchData, 1000);

  return () => clearInterval(interval);
  }, []);

  return (
    <>
     <div>
      {data ? (
        <div>
          <p>Simulated time: {data.sim_time_hour}:{data.sim_time_min}</p>
          <p>Baseload: {data.base_current_load} kWh</p>
          <p>Battery capacity: {data.battery_capacity_kWh} kWh</p>
          <p>Charging? {data.ev_battery_charge_start_stopp ? 'Yes' : 'No'}</p>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
    <div>
      <BatteryHandler />
    </div>
    </>
  )
}

export default App
