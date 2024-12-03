import { useEffect, useState } from 'react'
import axios from "axios"
import './App.css'
import BatteryHandler from './components/batteryHandler'

function App() {
  const [data, setData] = useState(null)
  const [baseload, setBaseload] = useState([])
  const [hourprice, setHourprice] = useState([])
  const [omptimalhour, setOptimalhour] = useState([]);

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

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/priceperhour')
      .then(response => {
        setHourprice(response.data)
      })
      .catch(error => console.log(error));
  }, []);

  useEffect(() =>{
    if(baseload.length > 0 && hourprice.length > 0) {
      const bestTimes = [];
      for (let i = 0; i < baseload.length; i++) {
        const totalConsumption = baseload[i] + 7.4; //laddstationen drar 7.4Kwh
        if (totalConsumption <= 11) { //får inte överstiga 11Kwh
          bestTimes.push({ hour: i, price: hourprice[i]});
        }
      }
      bestTimes.sort((a, b) => a.price - b.price);
      const cheapest = bestTimes.slice(0, 3); //de 3 bästa timmarna att ladda på
      setOptimalhour(cheapest);
    }
  }, [baseload, hourprice]);

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
        <h3>Residential Kwh</h3>
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
      <div className="priceperhour">
        <h3>Price per hour</h3>
        {hourprice ? (
          <div>
            {hourprice.map((price, index) => (
              <p key={index}>clock {index}:00 = {price}</p>
            ))}
          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className="besthours">
        <h3>Best charging hours</h3>
        {omptimalhour ? (
          <div>
            {omptimalhour.map((hour, index) => (
              <p key={index}>clock {hour.hour}:00 = {hour.price}</p>
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
