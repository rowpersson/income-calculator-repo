// src/components/MapComponent.js
import React, { useState, useEffect } from "react";
import Form from "./Form";
import Map from "./Map";
import TaxBreakdown from "./TaxBreakdown"; // Import the TaxBreakdown component

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [frequency, setFrequency] = useState("");
  const [geographies, setGeographies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Example Tax Breakdown Data
  const [taxData, setTaxData] = useState({
    salary: 200000,
    federalTax: 40088,
    stateTax: 12578,
    socialSecurity: 9114,
    medicare: 2900,
    sdi: 31.2,
    fli: 424,
    totalTax: 65135,
    netPay: 134865,
    marginalTaxRate: 45.0,
    averageTaxRate: 32.6,
  });

  useEffect(() => {
    const fetchGeographies = async () => {
      try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        setGeographies(data.objects.states.geometries);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setIsLoading(false);
      }
    };
    fetchGeographies();
  }, []);

  const handleMouseEnter = (geo) => setHoveredState(geo.id);
  const handleMouseLeave = () => setHoveredState(null);
  const handleDropdownChange = (event) => setSelectedState(event.target.value);
  const handleSalaryChange = (event) => setGrossSalary(event.target.value);
  const handleFrequencyChange = (event) => setFrequency(event.target.value);
  const handleCalculateClick = () => alert("Calculating...");

  if (isLoading) return <div>Loading map data...</div>;

  return (
    <div style={{ position: "relative", height: "80vh" }}>
      <Form
        grossSalary={grossSalary}
        handleSalaryChange={handleSalaryChange}
        frequency={frequency}
        handleFrequencyChange={handleFrequencyChange}
        selectedState={selectedState}
        handleDropdownChange={handleDropdownChange}
        geographies={geographies}
        handleCalculateClick={handleCalculateClick}
      />
      <Map
        geoUrl={geoUrl}
        hoveredState={hoveredState}
        selectedState={selectedState}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      
      {/* Add the Tax Breakdown component below the map */}
      <TaxBreakdown
        salary={taxData.salary}
        federalTax={taxData.federalTax}
        stateTax={taxData.stateTax}
        socialSecurity={taxData.socialSecurity}
        medicare={taxData.medicare}
        sdi={taxData.sdi}
        fli={taxData.fli}
        totalTax={taxData.totalTax}
        netPay={taxData.netPay}
        marginalTaxRate={taxData.marginalTaxRate}
        averageTaxRate={taxData.averageTaxRate}
      />
    </div>
  );
};

export default MapComponent;
