// src/components/MapComponent.js
import React, { useState, useEffect } from "react";
import Form from "./Form";
import Map from "./Map";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [frequency, setFrequency] = useState("");
  const [geographies, setGeographies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div style={{ position: "relative", height: "50vh" }}>
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
    </div>
  );
};

export default MapComponent;
