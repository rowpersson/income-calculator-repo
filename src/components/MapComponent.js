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
    if (originalSalary) {
      calculateTaxBreakdown();
    }
  }, [originalSalary, frequency, selectedState, k401Contribution, isRoth]); // Recalculate if 401k or Roth changes

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
    calculateTaxBreakdown();
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

    // Subtract the 401(k) contribution if it's traditional (pre-tax)
    if (!isRoth) {
      adjustedSalary -= k401Contribution;
    }

    switch (frequency) {
      case "monthly":
        adjustedSalary = salary / 12;
        break;
      case "weekly":
        adjustedSalary = salary / 52;
        break;
      case "bi-weekly":
        adjustedSalary = salary / 26;
        break;
      case "hourly":
        adjustedSalary = salary / 2080;
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
      rothContribution: isRoth ? k401Contribution : 0, // Only track Roth contributions if applicable
      preTax401k: isRoth ? 0 : k401Contribution, // Only track pre-tax contributions if it's a traditional 401k
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
        handle401kChange={handle401kChange}
        handleRothChange={handleRothChange}
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
        federalTax={taxData.federalTax}
        stateTax={taxData.stateTax}
        socialSecurity={taxData.socialSecurity}
        medicare={taxData.medicare}
        totalTax={taxData.totalTax}
        netPay={taxData.netPay}
        marginalTaxRate={taxData.marginalTaxRate}
        averageTaxRate={taxData.averageTaxRate}
        rothContribution={taxData.rothContribution}
        preTax401k={taxData.preTax401k} // Show the pre-tax 401k contribution
        style={{ marginTop: "20px", zIndex: 2 }} // Ensure tax breakdown is above map
      />
    </div>
  );
};

export default MapComponent;
