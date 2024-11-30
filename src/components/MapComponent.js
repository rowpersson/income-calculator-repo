import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null); // For tracking hover
  const [selectedState, setSelectedState] = useState(""); // For tracking selected state from dropdown
  const [grossSalary, setGrossSalary] = useState(""); // For tracking the gross salary input
  const [frequency, setFrequency] = useState(""); // For tracking frequency dropdown (default is blank)
  const [geographies, setGeographies] = useState([]); // To store the geography data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Load geography data on component mount
  useEffect(() => {
    const fetchGeographies = async () => {
      try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        setGeographies(data.objects.states.geometries); // Assuming 'states' is the key where the geometries are stored
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setIsLoading(false);
      }
    };
    fetchGeographies();
  }, []);

  // Function to handle mouse enter event (hovering over a state)
  const handleMouseEnter = (geo) => {
    setHoveredState(geo.id); // Set the hovered state to the state id
  };

  // Function to handle mouse leave event (stopping hover over a state)
  const handleMouseLeave = () => {
    setHoveredState(null); // Reset hovered state
  };

  // Function to handle change in dropdown selection for state
  const handleDropdownChange = (event) => {
    const selected = event.target.value;
    setSelectedState(selected); // Update the selected state when the dropdown changes
  };

  // Function to handle change in salary input
  const handleSalaryChange = (event) => {
    setGrossSalary(event.target.value); // Update salary value
  };

  // Function to handle change in frequency dropdown
  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value); // Update frequency value
  };

  if (isLoading) {
    return <div>Loading map data...</div>;
  }

  return (
    <div style={{ position: "relative", height: "50vh" }}>
      {/* Container for text boxes and dropdowns */}
      <div
        style={{
          position: "absolute",
          top: "100px", // Adjust the distance from the top of the map
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2,
          display: "flex", // Align the elements horizontally
          gap: "10px", // Space between elements
        }}
      >
        {/* Gross Salary Input */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label htmlFor="grossSalary" style={{ fontSize: "12px", marginBottom: "4px", marginLeft: "-5px" }}>
            Enter gross income
          </label>
          <input
            id="grossSalary"
            type="text"
            value={grossSalary}
            onChange={handleSalaryChange}
            placeholder="Gross Salary"
            style={{
              padding: "8px",
              fontSize: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "150px", // Width for the salary input box
              textAlign: "center",
            }}
          />
        </div>

        {/* Frequency Dropdown */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label htmlFor="frequency" style={{ fontSize: "12px", marginBottom: "4px", marginLeft: "-5px" }}>
            Frequency
          </label>
          <select
            id="frequency"
            value={frequency}
            onChange={handleFrequencyChange}
            style={{
              padding: "8px",
              fontSize: "12px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              width: "150px", // Width for the dropdown
              textAlign: "center",
            }}
          >
            <option value="">Select Frequency</option> {/* Blank default value */}
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="daily">Daily</option>
            <option value="hourly">Hourly</option>
          </select>
        </div>

        {/* State Dropdown + Calculate Button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <label htmlFor="state" style={{ fontSize: "12px", marginBottom: "4px", marginLeft: "-5px" }}>
              Choose a state
            </label>
            <select
              id="state"
              value={selectedState || ""}
              onChange={handleDropdownChange}
              style={{
                padding: "8px",
                fontSize: "12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "150px", // Width for the state dropdown
                textAlign: "center",
              }}
            >
              <option value="">Select a State</option>
              {/* Populate dropdown with states */}
              {geographies.map((geo) => (
                <option key={geo.id} value={geo.properties.name}>
                  {geo.properties.name}
                </option>
              ))}
            </select>
          </div>

          {/* Calculate Button */}
          <button
            onClick={() => alert('Calculating...')} // You can replace this with your actual calculation logic
            style={{
              padding: "8px 16px",
              fontSize: "12px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Calculate
          </button>
        </div>
      </div>

      {/* Map component */}
      <ComposableMap
        projection="geoAlbersUsa"
        projectionConfig={{
          scale: 500, // Adjust the scale value to zoom out (lower value)
        }}
        style={{ position: "relative", zIndex: 1, top: "-120px" }} // Keep the map below the dropdown
      >
        <Geographies geography={geoUrl}>
          {({ geographies, outline, borders }) => (
            <>
              <Geography geography={outline} fill="#E9E3DA" />
              <Geography geography={borders} fill="none" stroke="#FFF" />

              {geographies && geographies.map((geo) => {
                const isSelected = geo.properties.name === selectedState; // Check if this state is the selected one
                const isHovered = geo.id === hoveredState; // Check if the state is being hovered

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleMouseEnter(geo)} // Trigger on mouse enter
                    onMouseLeave={handleMouseLeave} // Trigger on mouse leave
                    fill={
                      isHovered
                        ? "#FF5733" // Highlight on hover
                        : isSelected
                        ? "#E42A1D" // Highlight selected state
                        : "#D6D6DA"
                    }
                    stroke="#333"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                      },
                      hover: {
                        fill: "#FF5733",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "#E42A1D", // Color for selected state
                      },
                    }}
                  />
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default MapComponent;
