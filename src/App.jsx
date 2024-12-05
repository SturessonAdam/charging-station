import { useEffect, useState, useMemo } from 'react'
import axios from "axios"
import './App.css'
import BatteryHandler from './components/BatteryHandler'

function App() {
  const [data, setData] = useState(null)
  const [baseload, setBaseload] = useState([])
  const [hourprice, setHourprice] = useState([])
  const [showExplanation, setShowExplanation] = useState(false);

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

  const optimalhour = useMemo(() => {
    if (baseload.length > 0 && hourprice.length > 0) {
      const bestTimes = [];
      for (let i = 0; i < baseload.length; i++) {
        const totalConsumption = baseload[i] + 7.4; //laddstationen drar 7.4kWh
        if (totalConsumption <= 11) { //ska inte överskrida 11kWh 
          bestTimes.push({ hour: i, price: hourprice[i] });
        }
      }
      bestTimes.sort((a, b) => a.price - b.price);
      return bestTimes.slice(0, 4); //top 4 bästa tiderna att ladda på
    }
    return [];
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
              <BatteryHandler optimalhour={optimalhour} baseload={baseload}/>
            </div>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      <div className="baseload">
        <h3>Residential kWh</h3>
        {baseload ? (
          <div>
            {baseload.map((kWh, index) => (
              <p key={index}>clock {index}:00 = {kWh}kWh</p>
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
        {optimalhour ? (
          <div>
            {optimalhour.map((hour, index) => (
              <p key={index}>clock {hour.hour}:00 = {hour.price}</p>
            ))}
          <button 
            className="info-button" 
            onClick={() => setShowExplanation(!showExplanation)}
          >
            ❔
          </button>
            {showExplanation && (
              <div>
                <h3>Explanation</h3>
                <p>- Iterates baseload, adding 7.4(kWh)</p>
                <p>- Sorts everything equal to or under 11(kWh)</p>
                <p>- Picks the 4 best times compared to price per hour</p>
              </div>
            )}
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
