// src/components/Form.js
import React from "react";

const Form = ({
  grossSalary,
  handleSalaryChange,
  frequency,
  handleFrequencyChange,
  selectedState,
  handleDropdownChange,
  geographies,
  handleCalculateClick,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        display: "flex",
        gap: "10px",
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
            width: "150px",
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
            width: "150px",
            textAlign: "center",
          }}
        >
          <option value="">Select Frequency</option>
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
              width: "150px",
              textAlign: "center",
            }}
          >
            <option value="">Select a State</option>
            {geographies.map((geo) => (
              <option key={geo.id} value={geo.properties.name}>
                {geo.properties.name}
              </option>
            ))}
          </select>
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculateClick}
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
  );
};

export default Form;