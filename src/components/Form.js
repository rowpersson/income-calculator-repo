import React from "react";

// List of U.S. states 
const U_S_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", 
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", 
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", 
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
  "Virginia", "Washington", "Washington DC", "West Virginia", "Wisconsin", "Wyoming"
];

const Form = ({
    grossSalary,
    handleSalaryChange,
    frequency,
    handleFrequencyChange,
    selectedState,
    handleDropdownChange,
    geographies,
    handleCalculateClick,
    k401Contribution,
    handle401kChange,
    contributionType,
    handleContributionTypeChange,  // handle Roth/Traditional change
    handleRothChange,  // handle Roth toggle
}) => {
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form submission (page reload)
        handleCalculateClick(); // Call the parent function to calculate the tax breakdown
    };

    // Styles for form inputs and labels
    const inputStyle = {
        padding: "5px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "160px",
        textAlign: "center",
        transition: "border-color 0.3s ease",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
        marginBottom: "10px", // Space below input fields
        position: "relative", // Ensure form fields aren't obstructed
        zIndex: 4, // Ensure input fields are above other elements
    };

    const labelStyle = {
        fontSize: "16px",    // Increase the font size
        fontWeight: "bold",  // Make the label text bold
        marginBottom: "8px", // Adjust the space below the label if needed
        color: "black",      // Set the color to black
    };

    const formWrapperStyle = {
        width: "250px", // Set a fixed width for the form box
        padding: "20px",
        backgroundColor: "#f9f9f9", // Light background color
        borderRadius: "8px", // Rounded corners
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        gap: "20px", // Space between form groups
        position: "relative", // Ensure it's above other elements
        zIndex: 10, // Make sure the form is in front of the map
    };

    const formGroupStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start", // Align items to the start (left)
    };

    // Alphabetize and filter state options
    const stateOptions = Array.isArray(geographies)
        ? geographies
            .map((geo) => geo.properties.name)
            .filter((stateName) => U_S_STATES.includes(stateName)) // Filter out non-U.S. states
            .sort() // Alphabetical sorting
            .map((stateName, index) => (
                <option key={index} value={stateName}>
                    {stateName}
                </option>
            ))
        : [];

    return (
        <div style={formWrapperStyle}>
            {/* Gross Salary Input */}
            <div style={formGroupStyle}>
                <label htmlFor="grossSalary" style={labelStyle}>
                    Enter your annual gross income
                </label>
                <input
                    id="grossSalary"
                    type="number"
                    value={grossSalary}
                    onChange={handleSalaryChange}
                    placeholder="Gross Salary"
                    style={inputStyle}
                />
            </div>

            {/* Frequency Dropdown */}
            <div style={formGroupStyle}>
                <label htmlFor="frequency" style={labelStyle}>
                    Select time period
                </label>
                <select
                    id="frequency"
                    value={frequency}
                    onChange={handleFrequencyChange}
                    style={inputStyle}
                >
                    <option value="annual">Annual</option>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="bi-weekly">Bi-Weekly</option>
                    <option value="daily">Daily</option>
                    <option value="hourly">Hourly</option>
                </select>
            </div>

            {/* 401(k) Contribution Amount */}
            <div style={formGroupStyle}>
                <label htmlFor="contributionAmount" style={labelStyle}>
                    Enter your 401(k) / 457(b) / 503(b) annual contribution
                </label>
                <input
                    id="contributionAmount"
                    type="number"
                    value={k401Contribution}
                    onChange={handle401kChange} // Update contribution amount in parent
                    placeholder="401(k) Amount"
                    style={inputStyle}
                />
                <label htmlFor="contributionAmount" style={{ fontSize: "12px" }}>
                    NOTE: the max contribution amount for this filing for 2025 is $23,500 annually
                </label>                
            </div>

            {/* 401(k) Contribution Type - Roth/Traditional */}
            <div style={formGroupStyle}>
                <label htmlFor="contributionType" style={labelStyle}>
                    Select your 401(k) type
                </label>
                <div>
                    <label>
                        <input
                            type="radio"
                            name="contributionType"
                            value="traditional"
                            checked={contributionType === "traditional"}
                            onChange={handleContributionTypeChange}
                        />
                        Traditional (Pre-tax)
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contributionType"
                            value="roth"
                            checked={contributionType === "roth"}
                            onChange={handleContributionTypeChange}
                        />
                        Roth (Post-tax)
                    </label>
                </div>
            </div>

            {/* State Dropdown + Calculate Button */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={formGroupStyle}>
                    <label htmlFor="state" style={labelStyle}>
                        Choose a state
                    </label>
                    <select
                        id="state"
                        value={selectedState || ""}
                        onChange={handleDropdownChange}
                        style={inputStyle}
                    >
                        <option value="">Select a State</option>
                        {stateOptions}
                    </select>
                </div>

                {/* Calculate Button */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: "#3498db", // Soft blue background
                        color: "white", // Text color
                        border: "none",
                        borderRadius: "5px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Shadow for button
                        transition: "background-color 0.3s, transform 0.1s ease, box-shadow 0.2s", // Smooth transitions
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#2980b9"} // Darker blue on hover
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#3498db"} // Revert back to original blue
                    onMouseDown={(e) => e.target.style.transform = "scale(0.98)"} // Slightly shrink on click
                    onMouseUp={(e) => e.target.style.transform = "scale(1)"} // Reset to original size
                >
                    Calculate
                </button>
            </div>
        </div>
    );
};

export default Form;
