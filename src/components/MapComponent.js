import React, { useState, useEffect } from "react";
import Form from "./Form";
import Map from "./Map";
import TaxBreakdown from "./TaxBreakdown"; // Import the TaxBreakdown component
import stateTaxRates from "../data/StateTaxRates"; // Import state tax rates from the external file

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [grossSalary, setGrossSalary] = useState(""); // Salary entered by the user
  const [frequency, setFrequency] = useState(""); // Frequency (monthly, yearly, etc.)
  const [selectedState, setSelectedState] = useState(""); // Store selected state
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
  const handleDropdownChange = (event) => {
    console.log("Selected State:", event.target.value); // Check if it's showing 'Colorado'
    setSelectedState(event.target.value);
  };
  const handleSalaryChange = (event) => setGrossSalary(event.target.value);
  const handleFrequencyChange = (event) => setFrequency(event.target.value);

  const handleCalculateClick = () => {
    calculateTaxBreakdown();
  };

  const calculateTaxBreakdown = () => {
    const salary = parseFloat(grossSalary);
    if (isNaN(salary) || salary <= 0) {
      return; // Skip if salary is invalid or zero
    }

    // Federal tax calculation (simplified)
    const federalTax = calculateFederalTax(salary);

    // State tax calculation (simplified)
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
      salary,
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

  // Update the calculateStateTax function to handle all states dynamically
  const calculateStateTax = (salary, state) => {
    // Retrieve the tax brackets for the selected state from the stateTaxRates object
    const brackets = stateTaxRates[state];

    if (!brackets) {
      return 0; // If no brackets exist (i.e., no state income tax), return 0
    }

    let tax = 0;
    let lastThreshold = 0;

    // Loop through the state tax brackets and calculate the tax owed
    for (const { rate, threshold } of brackets) {
      if (salary > threshold) {
        tax += (salary - lastThreshold) * (rate / 100);  // Apply the rate
        lastThreshold = threshold;
      } else {
        break;
      }
    }

    return tax;
  };

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
