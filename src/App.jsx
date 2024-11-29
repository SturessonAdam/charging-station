import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import BatteryHandler from './components/batteryHandler'

function App() {
  const [data, setData] = useState(null)
  const [baseload, setBaseload] = useState(null)

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

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/baseload')
      .then(response => {
        setBaseload(response.data)
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <>
    <div className="info-container">
      <div className="info-content">
        {data ? (
          <>
            <p>Simulated time: {data.sim_time_hour}:{data.sim_time_min}</p>
            <p>Baseload: {data.base_current_load} kWh</p>
            <p>Battery capacity: {data.battery_capacity_kWh} kWh</p>
            <p>Charging? {data.ev_battery_charge_start_stopp ? 'Yes' : 'No'}</p>
            <div className="button-container">
              <BatteryHandler />
            </div>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className="baseload">
        <h3>Baseload residential Kwh</h3>
        {baseload ? (
          <div>
            {baseload.map((Kwh, index) => (
              <p key={index}>clock {index}:00 = {Kwh}Kwh</p>
            ))}
          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    </div>
    </>
  )
}

export default App
