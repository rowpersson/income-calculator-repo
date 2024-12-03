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
    contributionAmount,
    handleContributionChange,
    contributionType,
    handleContributionTypeChange
}) => {
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form submission (page reload)
        handleCalculateClick(); // Call the parent function to calculate the tax breakdown
    };

    const inputStyle = {
        padding: "12px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        width: "160px",
        textAlign: "center",
        transition: "border-color 0.3s ease",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
        marginBottom: "10px", // Space below input fields
    };

    const labelStyle = {
        fontSize: "14px",
        marginBottom: "5px",
        color: "#333",
    };

    const containerStyle = {
        position: "absolute",
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2,
        display: "flex",
        justifyContent: "space-between", // Ensure space between the form elements
        gap: "15px",
    };

    const formGroupStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    };

    // Ensure geographies is an array before trying to map over it
    const stateOptions = Array.isArray(geographies) ? geographies.map((geo) => (
        <option key={geo.id} value={geo.properties.name}>
            {geo.properties.name}
        </option>
    )) : [];

    return (
        <div style={containerStyle}>
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
                    Enter which breakdown you would like to see
                </label>
                <select
                    id="frequency"
                    value={frequency}
                    onChange={handleFrequencyChange}
                    style={inputStyle}
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

            {/* 401(k) Contribution Amount */}
            <div style={formGroupStyle}>
                <label htmlFor="contributionAmount" style={labelStyle}>
                    Enter your 401(k) contribution
                </label>
                <input
                    id="contributionAmount"
                    type="number"
                    value={contributionAmount}
                    onChange={handleContributionChange} // Update contribution amount in parent
                    placeholder="401(k) Amount"
                    style={inputStyle}
                />
            </div>

            {/* 401(k) Contribution Type */}
            <div style={formGroupStyle}>
                <label htmlFor="contributionType" style={labelStyle}>
                    Select your 401(k) type
                </label>
                <select
                    id="contributionType"
                    value={contributionType}
                    onChange={handleContributionTypeChange} // Update contribution type in parent
                    style={inputStyle}
                >
                    <option value="traditional">Traditional (Pre-tax)</option>
                    <option value="roth">Roth (Post-tax)</option>
                </select>
            </div>

            {/* State Dropdown + Calculate Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
                        fontSize: "14px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Shadow effect
                    }}
                >
                    Calculate
                </button>
            </div>
        </div>
    );
};

export default Form;