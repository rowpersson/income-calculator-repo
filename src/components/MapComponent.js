import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Map from "../components/Map";
import TaxBreakdown from "../components/TaxBreakdown"; // Import the TaxBreakdown component
import stateTaxRates from "../data/StateTaxRates"; // Import stateTaxRates
import StateTaxBox from '../components/StateTaxBox'; 
import { textBoxNote } from "../components/TaxInfo";
import { Link } from "react-router-dom";  // Import the Link component for navigation

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [grossSalary, setGrossSalary] = useState(""); // Salary entered by the user
  const [frequency, setFrequency] = useState("annual"); // Default frequency is annual
  const [selectedState, setSelectedState] = useState(""); // State selected by user
  const [geographies, setGeographies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for storing tax data that will be displayed
  const [taxData, setTaxData] = useState({
    salary: 0,
    federalTax: 0,
    stateTax: 0,
    socialSecurity: 0,
    medicare: 0,
    totalTax: 0,
    netPay: 0,
    averageTaxRate: 0,
    rothContribution: 0, // Track Roth contribution separately
    preTax401k: 0, // Track Pre-tax 401(k) contribution
  });

  const [originalSalary, setOriginalSalary] = useState(null);
  const [k401Contribution, setK401kContribution] = useState(0); // Store the 401(k) contribution amount
  const [isRoth, setIsRoth] = useState(false); // Track if the 401(k) contribution is Roth or traditional
  const [isCalculated, setIsCalculated] = useState(false); // Track if Calculate button has been clicked

  const [fileType, setFileType] = useState(); // Default to CSV

  useEffect(() => {
    const fetchGeographies = async () => {
      try {
        const response = await fetch(geoUrl);
        const data = await response.json();
        setGeographies(data.objects.states.geometries);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error("Error loading map data:", error);
        setIsLoading(false);
      }
    };
    fetchGeographies();
  }, []);

/* eslint-disable react-hooks/exhaustive-deps */
useEffect(() => {
  // Only run when calculate button is clicked
  if (originalSalary && isCalculated) {
    calculateTaxBreakdown();
  }
}, [
  frequency,
  selectedState,
  k401Contribution,
  isRoth,
  isCalculated,
  originalSalary,
]); // Include necessary dependencies
/* eslint-enable react-hooks/exhaustive-deps */

  const handleMouseEnter = (geo) => setHoveredState(geo.id);
  const handleMouseLeave = () => setHoveredState(null);
  const handleDropdownChange = (event) => setSelectedState(event.target.value);
  const handleSalaryChange = (event) => {
    setGrossSalary(event.target.value);
    setOriginalSalary(event.target.value); // Save the original salary when it changes
  };
  const handleFrequencyChange = (event) => setFrequency(event.target.value);
  const handle401kChange = (event) => setK401kContribution(parseFloat(event.target.value) || 0);
  const handleRothChange = (event) => setIsRoth(event.target.checked);
  const handleCalculateClick = () => {
    setOriginalSalary(grossSalary); // Only update original salary when calculate button is clicked
    setIsCalculated(true); // Mark that the calculation has been triggered
  };

  // Handle click on a state from the map
  const handleStateClick = (stateId) => {
    setSelectedState(stateId);
    };

  // Tax calculation functions
  const calculateStateTax = (salary, state) => {
    const brackets = stateTaxRates[state];
    if (!brackets) {
      return 0; // No tax if the state doesn't have income tax
    }
    
    let tax = 0;
    let lastThreshold = 0;
  
    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        // Apply tax only to the income within this bracket
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * (bracket.rate / 100);
        lastThreshold = bracket.threshold;
      } else {
        // No need to continue if the salary is below the current threshold
        break;
      }
    }
  
    // Final portion of salary above the last threshold, if any
    if (salary > lastThreshold) {
      tax += (salary - lastThreshold) * (brackets[brackets.length - 1].rate / 100);
    }
  
    return tax;
  };
  

  const calculateFederalTax = (salary, frequency) => {
    const brackets = [
      { threshold: 11000, rate: 0.1 },
      { threshold: 44725, rate: 0.12 },
      { threshold: 95375, rate: 0.22 },
      { threshold: 182100, rate: 0.24 },
      { threshold: 231250, rate: 0.32 },
      { threshold: 578100, rate: 0.35 },
      { threshold: Infinity, rate: 0.37 },
    ];
    let tax = 0;
    let lastThreshold = 0;
    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        tax += (bracket.threshold - lastThreshold) * bracket.rate;
        lastThreshold = bracket.threshold;
      } else {
        tax += (salary - lastThreshold) * bracket.rate;
        break;
      }
    }
    let adjustedTax = tax;
    switch (frequency) {
      case "monthly":
        adjustedTax = adjustedTax / 12;
        break;
      case "weekly":
        adjustedTax = adjustedTax / 52;
        break;
      case "bi-weekly":
        adjustedTax = adjustedTax / 26;
        break;
      case "hourly":
        adjustedTax = adjustedTax / 2080;
        break;
      case "annual":
      default:
        break;
    }
    return adjustedTax;
  };

  // Define calculateTaxBreakdown outside useEffect to avoid the use-before-define warning
  const calculateTaxBreakdown = () => {
    let salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return; // Skip if salary is invalid or zero
    }

    let annualSalary = salary;
    let adjustedSalary = salary;
    let adjusted401kContribution = k401Contribution;

    switch (frequency) {
      case "monthly":
        adjusted401kContribution = k401Contribution / 12;
        break;
      case "weekly":
        adjusted401kContribution = k401Contribution / 52;
        break;
      case "bi-weekly":
        adjusted401kContribution = k401Contribution / 26;
        break;
      case "hourly":
        adjusted401kContribution = k401Contribution / 2080;
        break;
      case "annual":
      default:
        break;
    }

    if (!isRoth) {
      adjustedSalary -= k401Contribution;
    }

    const federalTax = calculateFederalTax(adjustedSalary, "annual");
    const stateTax = calculateStateTax(adjustedSalary, selectedState);
    const socialSecurity = Math.min(adjustedSalary * 0.062, 160200 * 0.062);
    const medicare = adjustedSalary * 0.0145;
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    let netPay = adjustedSalary - totalTax;
    if (isRoth) {
      netPay -= k401Contribution;
    }

    const averageTaxRate = totalTax / adjustedSalary * 100;

    let displaySalary = annualSalary;
    let displayFederalTax = federalTax;
    let displayStateTax = stateTax;
    let displaySocialSecurity = socialSecurity;
    let displayMedicare = medicare;
    let displayTotalTax = totalTax;
    let displayNetPay = netPay;

    switch (frequency) {
      case "monthly":
        displaySalary = annualSalary / 12;
        displayFederalTax = federalTax / 12;
        displayStateTax = stateTax / 12;
        displaySocialSecurity = socialSecurity / 12;
        displayMedicare = medicare / 12;
        displayTotalTax = totalTax / 12;
        displayNetPay = netPay / 12;
        break;
      case "weekly":
        displaySalary = annualSalary / 52;
        displayFederalTax = federalTax / 52;
        displayStateTax = stateTax / 52;
        displaySocialSecurity = socialSecurity / 52;
        displayMedicare = medicare / 52;
        displayTotalTax = totalTax / 52;
        displayNetPay = netPay / 52;
        break;
      case "bi-weekly":
        displaySalary = annualSalary / 26;
        displayFederalTax = federalTax / 26;
        displayStateTax = stateTax / 26;
        displaySocialSecurity = socialSecurity / 26;
        displayMedicare = medicare / 26;
        displayTotalTax = totalTax / 26;
        displayNetPay = netPay / 26;
        break;
      case "hourly":
        displaySalary = annualSalary / 2080;
        displayFederalTax = federalTax / 2080;
        displayStateTax = stateTax / 2080;
        displaySocialSecurity = socialSecurity / 2080;
        displayMedicare = medicare / 2080;
        displayTotalTax = totalTax / 2080;
        displayNetPay = netPay / 2080;
        break;
      case "annual":
      default:
        break;
    }

    setTaxData({
      salary: displaySalary,
      federalTax: displayFederalTax,
      stateTax: displayStateTax,
      socialSecurity: displaySocialSecurity,
      medicare: displayMedicare,
      totalTax: displayTotalTax,
      netPay: displayNetPay,
      averageTaxRate,
      rothContribution: isRoth ? adjusted401kContribution : 0,
      preTax401k: isRoth ? 0 : adjusted401kContribution,
    });
  };

  const displaySalary = () => {
    let salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return 0;
    }
    switch (frequency) {
      case "monthly":
        return salary / 12;
      case "weekly":
        return salary / 52;
      case "bi-weekly":
        return salary / 26;
      case "hourly":
        return salary / 2080;
      case "annual":
      default:
        return salary;
    }
  };

  const handleContributionTypeChange = (event) => {
    setIsRoth(event.target.value === "roth"); // Set isRoth to true if Roth is selected
  };

  // Function to export tax data as CSV
  const exportTaxData = () => {
    const csvContent = [
      ["State", "Frequency", "Salary", "Federal Tax", "State Tax", "Social Security", "Medicare", "Total Tax", "Net Pay", "Average Tax Rate", "Roth 401k Contribution", "Pre-tax 401k Contribution"],
      [
        selectedState,
        frequency,
        taxData.salary,
        taxData.federalTax,
        taxData.stateTax,
        taxData.socialSecurity,
        taxData.medicare,
        taxData.totalTax,
        taxData.netPay,
        taxData.averageTaxRate,
        taxData.rothContribution,
        taxData.preTax401k,
      ]
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tax_breakdown.csv"; 
    link.click(); 
  };

  // Function to export tax data as Text file
  const exportTaxDataAsText = () => {
    const textContent = `
      Tax Breakdown Report for $${taxData.salary} ${frequency} in ${selectedState}
      ============================
      Federal Tax: $${taxData.federalTax}
      State Tax: $${taxData.stateTax}
      Social Security: $${taxData.socialSecurity}
      Medicare: $${taxData.medicare}
      Total Tax: $${taxData.totalTax}
      Net Pay: $${taxData.netPay}
      Average Tax Rate: ${taxData.averageTaxRate}%
      Roth 401k Contribution: $${taxData.rothContribution}
      Pre-tax 401k Contribution: $${taxData.preTax401k}

      ============================
      Thank you for using the tax calculator!
    `;

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "tax_breakdown.txt"; 
    link.click(); 
  };

  // Function to handle Export based on file type (CSV or Text)
    const handleExport = () => {
    console.log("Exporting as:", fileType); // Add a console log for debugging
    
    if (fileType === "csv") {
      exportTaxData(); // Export as CSV
    } else if (fileType === "text") {
      exportTaxDataAsText(); // Export as Text file
    } else {
      console.log("Invalid file type selected.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stack elements vertically
        minHeight: "100vh", // Full height of the viewport
        padding: "20px",
        position: "relative", // Absolute positioning works for text box note
        backgroundColor: "#f4f7f6", // Light background color for overall page
        maxWidth: "1400px"
      }}
      >
        {/* Horizontal Banner */}
        <div
      style={{
        width: "100%", // Full width of the page
        height: "50px", // Set a fixed height for the banner
        backgroundColor: "#2980b9", // Color for the banner (change to any color)
        display: "flex",
        justifyContent: "center", // Center content horizontally
        alignItems: "center", // Center content vertically
        color: "#fff", // White text color
        fontWeight: "bold", // Make the text bold
      }}
      >
      {/* First Button: Stay on Home */}
      <button
        onClick={() => console.log("Home button clicked")}
        style={{
          backgroundColor: "#fff",
          color: "#2980b9",
          padding: "8px 30px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          marginRight: "10px"
        }}
      >
        Calculator Home
      </button>

      {/* Second Button: Link to Another Page */}
      <Link to="/tax-information"> 
        <button
          style={{
            backgroundColor: "#fff",
            color: "#2980b9",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "5px"
          }}
        >
          Additional Tax Information
        </button>
      </Link>
    </div>

      {/* Title for Page */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "32px", // Larger font for visibility
          marginBottom: "1px",
          fontWeight: "bold",
          color: "#2c3e50", // Dark text for contrast
        }}
      >
        United States Income Tax Calculator
      </h2>
  
      {/* Sub-title */}
      <h3
        style={{
          textAlign: "center",
          fontSize: "18px",
          marginBottom: "30px",
          fontWeight: "normal",
          color: "#7f8c8d", // Soft gray for subheading
        }}
      >
        Hello! Please enter your information and press "calculate" to see your tax withholding information.
      </h3>
  
      {/* Main Section with Form and Map */}
      <div
        style={{
          display: "flex", // Use flexbox for horizontal layout
          justifyContent: "space-between", // Space the form and map evenly
          backgroundColor: "#ffffff", // Set background color for the entire section
          borderRadius: "8px", // Rounded corners for both containers
          padding: "20px", // Add padding around the sections
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Light shadow for the overall container
          marginBottom: "30px", // Space below the section
        }}
      >
        {/* Form Section */}
        <div
          style={{
            flex: 0.45, // Takes up 50% of the space (or adjust as needed)
            backgroundColor: "#f9f9f9", // Same background color as the map section
            borderRadius: "8px", // Rounded corners for the form container
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Same shadow as the map
            padding: "20px", // Padding inside the container
            marginRight: "20px", // Space between form and map
          }}
        >
          <Form
            grossSalary={grossSalary}
            handleSalaryChange={handleSalaryChange}
            frequency={frequency}
            handleFrequencyChange={handleFrequencyChange}
            selectedState={selectedState}
            onStateChange={handleDropdownChange}
            handleDropdownChange={handleDropdownChange}
            geographies={geographies}
            handleCalculateClick={handleCalculateClick}
            k401Contribution={k401Contribution}
            handle401kChange={handle401kChange}
            handleRothChange={handleRothChange}
            contributionType={isRoth ? "roth" : "traditional"}
            handleContributionTypeChange={handleContributionTypeChange}
          />
        </div>
  
        {/* Map Section */}
        <div
          style={{
            flex: 2, // Takes up 50% of the space (or adjust as needed)
            height: "100vh", // Set map height to 50% of the viewport height
            position: "relative", // Keep relative positioning for map shadow
            borderRadius: "8px", // Rounded corners for the map container
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Same shadow as the form
            backgroundColor: "#f9f9f9", // Same background color as the form section
          }}
        >
          {isLoading ? (
            <div
              style={{
                textAlign: "center",
                paddingTop: "20px",
                fontSize: "18px",
                color: "#7f8c8d", // Soft gray text while loading
              }}
            >
              Loading map...
            </div>
          ) : (
            <Map
              geoUrl={geoUrl}
              hoveredState={hoveredState}
              selectedState={selectedState}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              onStateClick={handleStateClick}
            />
          )}
        </div>
      </div>
  
      {/* State Tax Info Section */}
      <div
        style={{
          backgroundColor: "#ffffff", // White background for the state tax info
          borderRadius: "8px", // Rounded corners for the state tax box
          padding: "20px", // Padding inside the container
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", // Light shadow for the state tax box
          marginBottom: "30px", // Space between state tax info and map
        }}
      >
        <StateTaxBox selectedState={selectedState} />
      </div>
  
      {/* Tax Breakdown Section */}
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          padding: "20px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px", // Space between tax breakdown and export options
        }}
      >
        <TaxBreakdown
          salary={displaySalary()}
          federalTax={isCalculated ? taxData.federalTax : "___"}
          stateTax={isCalculated ? taxData.stateTax : "___"}
          socialSecurity={isCalculated ? taxData.socialSecurity : "___"}
          medicare={isCalculated ? taxData.medicare : "___"}
          totalTax={isCalculated ? taxData.totalTax : "___"}
          rothContribution={isCalculated ? taxData.rothContribution : "___"}
          preTax401k={isCalculated ? taxData.preTax401k : "___"}
          netPay={isCalculated ? taxData.netPay : "___"}
          averageTaxRate={isCalculated ? taxData.averageTaxRate : ""}
          style={{
            overflow: "auto", // Allow overflow within the tax breakdown section
          }}
        />
      </div>
  
      {/* Add Export Format Selection */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          <input
            type="radio"
            name="fileType"
            value="csv"
            checked={fileType === "csv"}
            onChange={() => setFileType("csv")}
            style={{ marginRight: "5px" }}
          />
          CSV
        </label>
        <label>
          <input
            type="radio"
            name="fileType"
            value="text"
            checked={fileType === "text"}
            onChange={() => setFileType("text")}
            style={{ marginLeft: "20px", marginRight: "10px" }}
          />
          Text
        </label>
      </div>
  
      {/* Export Button */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
      <button
        onClick={handleExport}
        type="button"
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
    Export Tax Breakdown
        </button>
      </div>
  
      {/* Reference Link Text Area */}
      <textarea
        placeholder="For reference, please find the breakdown of 2024 state income taxes here: https://taxfoundation.org/data/all/state/state-income-tax-rates-2024/"
        style={{
          width: "100%",
          height: "20px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#333",
          backgroundColor: "#f9f9f9",
          marginBottom: "30px",
        }}
      />
  
      {/* Text Box Note - Positioned at the Upper Right */}
      <div
        style={{
          position: "absolute",
          top: "75px",
          right: "20px",
          width: "250px",
          padding: "15px",
          backgroundColor: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          fontSize: "14px",
          color: "#2c3e50",
          zIndex: 10,
        }}
        dangerouslySetInnerHTML={{ __html: textBoxNote }}
      />
    </div>
  );
   
};

export default MapComponent;