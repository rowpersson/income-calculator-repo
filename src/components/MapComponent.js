import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Map from "../components/Map";
import TaxBreakdown from "../components/TaxBreakdown"; // Import the TaxBreakdown component
import stateTaxRates from "../data/StateTaxRates"; // Import stateTaxRates

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
    marginalTaxRate: 0,
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
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setIsLoading(false);
      }
    };
    fetchGeographies();
  }, []);

  useEffect(() => {
    // Only run when calculate button is clicked
    if (originalSalary && isCalculated) {
      calculateTaxBreakdown();
    }
  }, [frequency, selectedState, k401Contribution, isRoth, isCalculated]); // Include isCalculated to trigger on button press

  const handleMouseEnter = (geo) => setHoveredState(geo.id);
  const handleMouseLeave = () => setHoveredState(null);
  const handleDropdownChange = (event) => setSelectedState(event.target.value);
  const handleSalaryChange = (event) => {
    setGrossSalary(event.target.value);
    setOriginalSalary(event.target.value); // Save the original salary when it changes
  };
  const handleFrequencyChange = (event) => {
    setFrequency(event.target.value);
  };

  const handle401kChange = (event) => {
    setK401kContribution(parseFloat(event.target.value) || 0); // Handle 401k contribution change
  };

  const handleRothChange = (event) => {
    setIsRoth(event.target.checked); // Handle Roth 401k toggle
  };

  const handleCalculateClick = () => {
    setOriginalSalary(grossSalary); // Only update original salary when calculate button is clicked
    setIsCalculated(true); // Mark that the calculation has been triggered
  };

  const calculateStateTax = (salary, state) => {
    const brackets = stateTaxRates[state];

    if (!brackets) {
      return 0; // No tax if the state doesn't have income tax (e.g., Texas, Florida, etc.)
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

    if (frequency !== "annual") {
      salary *= 12; // Convert monthly, weekly, or bi-weekly to annual salary
    }

    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * bracket.rate;
        lastThreshold = bracket.threshold;
      } else {
        break;
      }
    }

    if (salary > lastThreshold) {
      tax += (salary - lastThreshold) * brackets[brackets.length - 1].rate;
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

  const calculateTaxBreakdown = () => {
    let salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return; // Skip if salary is invalid or zero
    }
  
    let adjustedSalary = salary;
    let annualSalary = salary; // Store the annual salary for tax calculations
  
    // Adjust the 401(k) contribution based on frequency
    let adjusted401kContribution = k401Contribution; // Default to the entered contribution amount
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
  
    // Subtract the 401(k) contribution if it's traditional (pre-tax)
    if (!isRoth) {
      adjustedSalary -= adjusted401kContribution; // Reduce salary by adjusted 401(k) contribution (pre-tax)
    }
  
    // Now adjust salary based on frequency (if monthly, weekly, etc.)
    switch (frequency) {
      case "monthly":
        adjustedSalary = adjustedSalary / 12;
        break;
      case "weekly":
        adjustedSalary = adjustedSalary / 52;
        break;
      case "bi-weekly":
        adjustedSalary = adjustedSalary / 26;
        break;
      case "hourly":
        adjustedSalary = adjustedSalary / 2080;
        break;
      case "annual":
      default:
        break;
    }
  
    // Calculate federal tax, state tax, social security, medicare
    const federalTax = calculateFederalTax(adjustedSalary, frequency);
    const stateTax = calculateStateTax(adjustedSalary, selectedState);
  
    const socialSecurity = Math.min(adjustedSalary * 0.062, 160200 * 0.062);
    const medicare = adjustedSalary * 0.0145;
  
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    const netPay = adjustedSalary - totalTax;
  
    const marginalTaxRate = (federalTax + stateTax) / adjustedSalary * 100;
    const averageTaxRate = totalTax / adjustedSalary * 100;
  
    // Update tax data state with Roth contribution and pre-tax 401(k)
    setTaxData({
      salary: annualSalary,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTax,
      netPay,
      marginalTaxRate,
      averageTaxRate,
      rothContribution: isRoth ? adjusted401kContribution : 0, // Adjusted Roth contribution (post-tax)
      preTax401k: isRoth ? 0 : adjusted401kContribution, // Adjusted pre-tax contribution (pre-tax)
    });
  };
  
  

  const displaySalary = () => {
    let salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return 0; // If salary is invalid, show 0
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
    <div style={{ display: "flex", flexDirection: "column", position: "relative", height: "80vh", padding: "10px" }}>
      {/* Form Section */}
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
        style={{ marginBottom: "20px", zIndex: 3 }} // Higher zIndex for form fields
      />
      {/* Map Section */}
      <div style={{ flex: 1, height: "50vh", zIndex: 1, position: "relative" }}> {/* Map should take half the viewport height */}
        <Map
          geoUrl={geoUrl}
          hoveredState={hoveredState}
          selectedState={selectedState}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
        />
      </div>
      {/* Tax Breakdown Section */}
      <TaxBreakdown
        salary={displaySalary()}
        federalTax={isCalculated ? taxData.federalTax : "___"}
        stateTax={isCalculated ? taxData.stateTax : "___"}
        socialSecurity={isCalculated ? taxData.socialSecurity : "___"}
        medicare={isCalculated ? taxData.medicare : "___"}
        totalTax={isCalculated ? taxData.totalTax : "___"}
        netPay={isCalculated ? taxData.netPay : "___"}
        marginalTaxRate={isCalculated ? taxData.marginalTaxRate : "___"}
        averageTaxRate={isCalculated ? taxData.averageTaxRate : "___"}
        rothContribution={isCalculated ? taxData.rothContribution : "___"}
        preTax401k={isCalculated ? taxData.preTax401k : "___"} // Show the pre-tax 401k contribution
        style={{ marginTop: "20px", zIndex: 2 }} // Ensure tax breakdown is above map
      />
    </div>
  );
};

export default MapComponent;