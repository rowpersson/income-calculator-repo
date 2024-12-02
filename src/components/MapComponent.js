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
  });

  // Store the original salary separately
  const [originalSalary, setOriginalSalary] = useState(null);

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
    // Recalculate tax breakdown every time the salary or frequency changes
    if (originalSalary) {
      calculateTaxBreakdown();
    }
  }, [originalSalary, frequency, selectedState]); // Dependency on originalSalary, frequency, and selectedState

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

  const handleCalculateClick = () => {
    calculateTaxBreakdown();
  };

  // Define the calculateStateTax function here
  const calculateStateTax = (salary, state) => {
    const brackets = stateTaxRates[state];

    if (!brackets) {
      return 0; // No tax if the state doesn't have income tax (e.g., Texas, Florida, etc.)
    }

    let tax = 0;
    let lastThreshold = 0;

    // Loop through the tax brackets for the selected state
    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * (bracket.rate / 100);
        lastThreshold = bracket.threshold;
      } else {
        break;
      }
    }

    // Tax the remaining income above the last threshold
    if (salary > lastThreshold) {
      tax += (salary - lastThreshold) * (brackets[brackets.length - 1].rate / 100);
    }

    return tax;
  };

  const calculateTaxBreakdown = () => {
    let salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return; // Skip if salary is invalid or zero
    }

    // Adjust salary based on frequency (adjust the salary for state and other tax calculations)
    let adjustedSalary = salary; // Start with the gross salary
    let annualSalary = salary; // Store the annual salary for tax calculations

    switch (frequency) {
      case "monthly":
        adjustedSalary = salary / 12; // Monthly
        break;
      case "weekly":
        adjustedSalary = salary / 52; // Weekly
        break;
      case "bi-weekly":
        adjustedSalary = salary / 26; // Biweekly
        break;
      case "hourly":
        adjustedSalary = salary / 2080; // Hourly assuming 40 hours/week for 52 weeks
        break;
      case "annual":
      default:
        break;
    }

    // Federal tax calculation using the **adjusted salary** for the selected frequency
    const federalTax = calculateFederalTax(adjustedSalary, frequency);

    // State tax calculation using the adjusted salary based on frequency
    const stateTax = calculateStateTax(adjustedSalary, selectedState);

    // Social Security and Medicare (based on the adjusted salary)
    const socialSecurity = Math.min(adjustedSalary * 0.062, 160200 * 0.062); // Social Security cap for 2023
    const medicare = adjustedSalary * 0.0145; // Medicare tax (no cap)

    // Total tax and net pay
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    const netPay = adjustedSalary - totalTax;

    // Marginal and average tax rates based on adjusted salary
    const marginalTaxRate = (federalTax + stateTax) / adjustedSalary * 100;
    const averageTaxRate = totalTax / adjustedSalary * 100;

    // Update tax data state
    setTaxData({
      salary: annualSalary, // Store the original salary for display
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTax,
      netPay,
      marginalTaxRate,
      averageTaxRate,
    });
  };

  const calculateFederalTax = (salary, frequency) => {
    // Approximate progressive federal tax brackets for 2023 (simplified)
    const brackets = [
      { threshold: 10275, rate: 0.1 },
      { threshold: 41775, rate: 0.12 },
      { threshold: 89075, rate: 0.22 },
      { threshold: 170050, rate: 0.24 },
      { threshold: 215950, rate: 0.32 },
      { threshold: 539900, rate: 0.35 },
      { threshold: 999999999, rate: 0.37 },
    ];

    let tax = 0;
    let lastThreshold = 0;
    
    // Loop through the tax brackets and apply the correct rate
    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * bracket.rate;
        lastThreshold = bracket.threshold;
      } else {
        break;
      }
    }

    // Tax on the remaining income above the last threshold
    if (salary > lastThreshold) {
      tax += (salary - lastThreshold) * brackets[brackets.length - 1].rate;
    }

    // If we're calculating for a frequency (monthly, weekly), adjust the tax for that frequency
    switch (frequency) {
      case "monthly":
        tax = tax / 12;
        break;
      case "weekly":
        tax = tax / 52;
        break;
      case "bi-weekly":
        tax = tax / 26;
        break;
      case "hourly":
        tax = tax / 2080;
        break;
      case "annual":
      default:
        break;
    }

    return tax;
  };

  // Calculate and display the adjusted salary based on the selected frequency
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
      
      {/* Pass the dynamically calculated tax data to TaxBreakdown */}
      <TaxBreakdown
        salary={displaySalary()} // Show dynamically calculated salary
        federalTax={taxData.federalTax}
        stateTax={taxData.stateTax}
        socialSecurity={taxData.socialSecurity}
        medicare={taxData.medicare}
        totalTax={taxData.totalTax}
        netPay={taxData.netPay}
        marginalTaxRate={taxData.marginalTaxRate}
        averageTaxRate={taxData.averageTaxRate}
      />
    </div>
  );
};

export default MapComponent;
