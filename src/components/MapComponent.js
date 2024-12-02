import React, { useState, useEffect } from "react";
import Form from "./Form";
import Map from "./Map";
import TaxBreakdown from "./TaxBreakdown"; // Import the TaxBreakdown component
import stateTaxRates from "../data/StateTaxRates"; // Import state tax rates from StateTaxRates.js

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

  const calculateTaxBreakdown = () => {
    let salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return; // Skip if salary is invalid or zero
    }
  
    // Reset previous tax data to avoid accumulation
    setTaxData({
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
  
    // Store the original salary for federal tax calculation (don't adjust it for frequency)
    let annualSalary = salary;
  
    // Adjust salary based on frequency (adjust the salary for state and other tax calculations)
    switch (frequency) {
      case "monthly":
        salary = salary * 12; // Monthly to yearly
        break;
      case "weekly":
        salary = salary * 52; // Weekly to yearly
        break;
      case "bi-weekly":
        salary = salary * 26; // Biweekly to yearly
        break;
      case "hourly":
        salary = salary * 2080; // Assuming 40 hours/week for 52 weeks
        break;
      case "annual":
      default:
        break;
    }
  
    // Federal tax calculation (simplified) using the **annualized salary** (not the adjusted salary)
    const federalTax = calculateFederalTax(annualSalary);
  
    // State tax calculation (using the adjusted salary based on frequency)
    const stateTax = calculateStateTax(salary, selectedState);
  
    // Social Security and Medicare (approx.)
    const socialSecurity = Math.min(salary * 0.062, 160200 * 0.062); // Social Security cap for 2023
    const medicare = salary * 0.0145; // Medicare tax (no cap)
  
    // Total tax and net pay
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    const netPay = salary - totalTax;
  
    // Marginal and average tax rates
    const marginalTaxRate = (federalTax + stateTax) / salary * 100;
    const averageTaxRate = totalTax / salary * 100;
  
    // Update tax data state
    setTaxData({
      salary: annualSalary, // Store the original salary
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
  

  const calculateFederalTax = (salary) => {
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
    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * bracket.rate;
        lastThreshold = bracket.threshold;
      } else {
        break;
      }
    }
    return tax;
  };

  const calculateStateTax = (salary, state) => {
    // Look up the state's tax brackets from StateTaxRates.js
    const brackets = stateTaxRates[state];
  
    if (!brackets) return 0; // If no brackets found, return 0 (for no income tax states like Florida)
  
    if (brackets.length === 1 && brackets[0].rate === 0) {
      // Special case for states with no state income tax
      return 0;
    }
  
    // Check if the state has a flat rate tax (only one bracket with a rate)
    if (brackets.length === 1 && brackets[0].threshold === 0) {
      // It's a flat tax state like Colorado, so apply the rate to the entire salary
      return salary * brackets[0].rate / 100;
    }
  
    // For progressive tax states, calculate tax progressively
    let tax = 0;
    let lastThreshold = 0;
    
    for (const bracket of brackets) {
      if (salary > bracket.threshold) {
        // Tax the amount between the last threshold and the current bracket threshold
        tax += (Math.min(salary, bracket.threshold) - lastThreshold) * (bracket.rate / 100);
        lastThreshold = bracket.threshold;
      } else {
        break;
      }
    }
  
    // Tax the amount above the last bracket if salary exceeds the highest bracket
    if (salary > lastThreshold) {
      tax += (salary - lastThreshold) * (brackets[brackets.length - 1].rate / 100);
    }
  
    return tax;
  };

  useEffect(() => {
    // Recalculate the tax breakdown whenever the salary or frequency changes
    calculateTaxBreakdown();
  }, [grossSalary, frequency, selectedState]); // Dependencies are salary, frequency, and selected state

  if (isLoading) return <div>Loading map data...</div>;

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
        salary={taxData.salary}
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
