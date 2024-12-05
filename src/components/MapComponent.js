import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Map from "../components/Map";
import TaxBreakdown from "../components/TaxBreakdown"; // Import the TaxBreakdown component
import stateTaxRates from "../data/StateTaxRates"; // Import stateTaxRates
import StateTaxBox from '../components/StateTaxBox'; 
import { textBoxNote } from "../components/TaxInfo";

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
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * (bracket.rate / 100);
        lastThreshold = bracket.threshold;
      } else {
        break;
      }
    }
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

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Keep the main container as column
        minHeight: "100vh", // Ensure the page is at least 100vh
        padding: "10px",
        position: "relative", // Set relative positioning on the container to position text box absolutely
      }}
    >
      {/* Title for Page */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        United States Income Tax Calculator
      </h2>
      {/* Sub-title */}
      <h2
        style={{
          textAlign: "center",
          fontSize: "14px",
          marginBottom: "20px",
          fontWeight: "bold",
        }}
      >
        Hello! Please enter your information and press "calculate" to see your tax withholding information.
      </h2>
  
      {/* Form Section */}
      <div style={{ flexShrink: 0 }}>
        <Form
          grossSalary={grossSalary}
          handleSalaryChange={handleSalaryChange}
          frequency={frequency}
          handleFrequencyChange={handleFrequencyChange}
          selectedState={selectedState}
          handleDropdownChange={handleDropdownChange}
          geographies={geographies}
          handleCalculateClick={handleCalculateClick}
          k401Contribution={k401Contribution}
          handle401kChange={handle401kChange}
          handleRothChange={handleRothChange}
          contributionType={isRoth ? "roth" : "traditional"}
          handleContributionTypeChange={handleContributionTypeChange}
          style={{
            marginBottom: "50px", // Space between form and map
          }}
        />
      </div>

       {/* State Tax Info Section */}
       <div style={{ flexDirection: 'column', alignItems: 'left' }}>
        <StateTaxBox selectedState={selectedState} />
      </div>

      {/* Map Section */}
      <div
        style={{
          height: "50vh", // Make sure the map takes up 50% of the viewport height
          width: "110%",
          position: "relative",
          marginTop: "-200px", 
          marginBottom: "200px", // Give some space below the map
        }}
      >
        {isLoading ? (
          <div>Loading map...</div>
        ) : (
          <Map
            geoUrl={geoUrl}
            hoveredState={hoveredState}
            selectedState={selectedState}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
          />
        )}
      </div>
  
      {/* Tax Breakdown Section */}
      <div
        style={{
          flexShrink: 0, // Prevent shrinking
          marginTop: "10px", // Space between the map and the tax breakdown
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
  
      {/* Text Box Note - Positioned at the Upper Right */}
      <div
          style={{
          position: "absolute", // Position it absolutely within the container
          top: "10px", // 10px from the top
          right: "10px", // 10px from the right
          width: "250px", // Adjust width as needed
          padding: "10px", // Padding for the text box
          backgroundColor: "#f9f9f9", // Light background
          border: "1px solid #ddd", // Border around the text box
          borderRadius: "5px", // Rounded corners for the text box
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Optional: subtle shadow for a more card-like appearance
          zIndex: 10, // Ensure it's above other content
          fontSize: "14px",
        }}
        dangerouslySetInnerHTML={{ __html: textBoxNote }} // Use dangerouslySetInnerHTML to render HTML content
      />
    </div>
  );       
};

export default MapComponent;
