import React, { useState } from "react";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import InfoBox from "./Infobox";
// import InfoBox from './InfoBox';



ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const GHGEmissionsComparison = () => {
  const [formData, setFormData] = useState({
    baselineFuel: "",
    currentFuel: "",
    baselineGas: "",
    currentGas: "",
    baselineElectricity: "",
    currentElectricity: "",
    baselineFlights: "",
    currentFlights: "",
    baselineWaste: "",
    currentWaste: "",
    baselineWater: "",
    currentWater: "",
    baselineWFH: "",
    currentWFH: "",
  });
  


  const [results, setResults] = useState(null);
  const [donutChartData, setDonutChartData] = useState(null);
  const [changeChartData, setChangeChartData] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const calculateComparison = () => {
    const categories = [
      { key: "Fuel", baseline: "baselineFuel", current: "currentFuel" },
      { key: "Gas", baseline: "baselineGas", current: "currentGas" },
      { key: "Electricity", baseline: "baselineElectricity", current: "currentElectricity" },
      { key: "Flights", baseline: "baselineFlights", current: "currentFlights" },
      { key: "Waste", baseline: "baselineWaste", current: "currentWaste" },
      { key: "Water", baseline: "baselineWater", current: "currentWater" },
      { key: "Work from Home", baseline: "baselineWFH", current: "currentWFH" },
    ];

    const resultsData = categories.map(({ key, baseline, current }) => {
      const baselineValue = parseFloat(formData[baseline]) || 0;
      const currentValue = parseFloat(formData[current]) || 0;
      const change = currentValue - baselineValue;
      const percentChange = baselineValue !== 0 ? ((change / baselineValue) * 100).toFixed(2) : "0.00";
      return { category: key, baseline: baselineValue, current: currentValue, change, percentChange };
    });

    setResults(resultsData);

    // Calculate totals for Scope 1, Scope 2, and Scope 3
    const scope1 = resultsData.filter(result => result.category === "Fuel" || result.category === "Gas")
                               .reduce((sum, result) => sum + result.change, 0);
    const scope2 = resultsData.filter(result => result.category === "Electricity")
                               .reduce((sum, result) => sum + result.change, 0);
    const scope3 = resultsData.filter(result => result.category === "Flights" || result.category === "Waste" || result.category === "Water" || result.category === "Work from Home")
                               .reduce((sum, result) => sum + result.change, 0);

    const totalChange = scope1 + scope2 + scope3;

    // Prepare donut chart data (percentage of total for Scope 1, 2, 3)
    const total = totalChange !== 0 ? totalChange : 1;  // Avoid divide by 0
    const chartData = {
      labels: ['Scope 1', 'Scope 2', 'Scope 3'],
      datasets: [
        {
          label: 'GHG Emissions by Scope',
          data: [
            ((scope1 / total) * 100).toFixed(2),
            ((scope2 / total) * 100).toFixed(2),
            ((scope3 / total) * 100).toFixed(2),
          ],
          backgroundColor: ['#cccccc', '#434343', '#0c343d'],
          borderWidth: 1,
        },
      ],
    };

    setDonutChartData(chartData);

    // Prepare donut chart data for change (current - baseline)
    const changeChart = {
      labels: ['Fuel', 'Gas', 'Electricity', 'Flights', 'Waste', 'Water', 'Work from Home'],
      datasets: [
        {
          label: 'Change in GHG Emissions',
          data: resultsData.map(result => result.change),
          backgroundColor: ['#434343', '#666666', '#d9d9d9', '#000000', '#b6d7a8', '#93c47d', '#45818e'],
          borderWidth: 1,
        },
      ],
    };

    setChangeChartData(changeChart);
  };

  return (
    <div className="container">
      <h1>GHG Emissions Comparison Analysis</h1>
      <form id="ghgCalculator">
        <h3>Scope 1: Company Vehicles</h3>
        <label>Baseline Year Fuel Consumption (liters):</label>
        <input type="number" id="baselineFuel" placeholder="Enter baseline fuel" value={formData.baselineFuel}  onChange={handleChange} />
        <label>Current Year Fuel Consumption (liters):</label>
        <input type="number" id="currentFuel" placeholder="Enter current fuel" value={formData.currentFuel} onChange={handleChange} />

        <h3>Scope 1: Source of Heating (Natural Gas)</h3>
        <label>Baseline Year Gas Usage (m³):</label>
        <input type="number" id="baselineGas" placeholder="Enter baseline gas" value={formData.baselineGas} onChange={handleChange} />
        <label>Current Year Gas Usage (m³):</label>
        <input type="number" id="currentGas" placeholder="Enter current gas" value={formData.currentGas} onChange={handleChange} />

        <h3>Scope 2: Electricity</h3>
        <label>Baseline Year Electricity (kWh):</label>
        <input type="number" id="baselineElectricity" placeholder="Enter baseline electricity" value={formData.baselineElectricity} onChange={handleChange} />
        <label>Current Year Electricity (kWh):</label>
        <input type="number" id="currentElectricity" placeholder="Enter current electricity" value={formData.currentElectricity} onChange={handleChange} />

        <h3>Scope 3: Business Travel</h3>
        <label>Baseline Year Flights (kg CO2e):</label>
        <input type="number" id="baselineFlights" placeholder="Enter baseline flights emissions" value={formData.baselineFlights} onChange={handleChange} />
        <label>Current Year Flights (kg CO2e):</label>
        <input type="number" id="currentFlights" placeholder="Enter current flights emissions" value={formData.currentFlights} onChange={handleChange} />

        <h3>Scope 3: Waste</h3>
        <label>Baseline Year Waste (kg):</label>
        <input type="number" id="baselineWaste" placeholder="Enter baseline waste" value={formData.baselineWaste} onChange={handleChange} />
        <label>Current Year Waste (kg):</label>
        <input type="number" id="currentWaste" placeholder="Enter current waste" value={formData.currentWaste} onChange={handleChange} />

        <h3>Scope 3: Water Consumption</h3>
        <label>Baseline Year Water Usage (liters):</label>
        <input type="number" id="baselineWater" placeholder="Enter baseline water" value={formData.baselineWater} onChange={handleChange} />
        <label>Current Year Water Usage (liters):</label>
        <input type="number" id="currentWater" placeholder="Enter current water" value={formData.currentWater} onChange={handleChange} />

        <h3>Scope 3: Work from Home</h3>
        <label>Baseline Year Work from Home Emissions (kg CO2e):</label>
        <input type="number" id="baselineWFH" placeholder="Enter baseline WFH emissions" value={formData.baselineWFH} onChange={handleChange} />
        <label>Current Year Work from Home Emissions (kg CO2e):</label>
        <input type="number" id="currentWFH" placeholder="Enter current WFH emissions" value={formData.currentWFH} onChange={handleChange} />

        <button type="button" onClick={calculateComparison}>
          Compare Emissions
        </button>
      </form>

      {results && (
        <div className="result">
          <h3>Comparison Analysis Results</h3>
          {results.map((result) => (
            <div key={result.category}>
              <strong>{result.category}:</strong>
              <ul>
                <li>Baseline: {result.baseline.toFixed(2)}</li>
                <li>Current: {result.current.toFixed(2)}</li>
                <li>Change: {result.change.toFixed(2)} ({result.percentChange}%)</li>
              </ul>
            </div>
          ))}
        </div>
      )}

      
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {/* <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Your Company GHG Disclosure
      </h1> */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
        <div style={{ width: '45%' }}>
        {donutChartData && (
        <div className="result">
          <h3>Your Carbon Footprint</h3><br/>
           <Doughnut data={donutChartData} /> 
          
        </div>
      )} 
        </div>
        <div style={{ width: '45%' }}>
        {changeChartData && (
        <div className="result">
          <h3>Emissions </h3>
          <Doughnut data={changeChartData} />
        </div>
      )}
        </div>
      </div>
      {/* <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        What are scopes?
      </h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <InfoBox
          title="Scope 1"
          description="Direct emissions from the combustion of fuel in assets that a company operates, such as fuel emissions from company-owned cars, diesel generators, gas boilers and air-conditioning leaks."
        />
        <InfoBox
          title="Scope 2"
          description="Indirect emissions from the generation of energy purchased from a utility provider, such as heating, cooling, steam, and electricity."
        />
        <InfoBox
          title="Scope 3"
          description="All indirect greenhouse gas emissions that do not fall under scope 2 - upstream and downstream. This includes emissions from purchased goods and services, business travel, capital goods, and more."
        />
      </div>  */}
    </div>
     
      


    </div>
  );
};

export default GHGEmissionsComparison;
