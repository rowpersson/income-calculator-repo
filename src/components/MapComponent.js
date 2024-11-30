// src/components/MapComponent.js
import React, { useState, useEffect } from "react";
import Form from "./Form";
import Map from "./Map";
import TaxBreakdown from "./TaxBreakdown"; // Import the TaxBreakdown component

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// Example California State Tax Brackets for simplicity
const californiaTaxBrackets = [
  { threshold: 9325, rate: 0.01 },
  { threshold: 22107, rate: 0.02 },
  { threshold: 34892, rate: 0.04 },
  { threshold: 48435, rate: 0.06 },
  { threshold: 61214, rate: 0.08 },
  { threshold: 312686, rate: 0.093 },
  { threshold: 999999999, rate: 0.103 }, // Upper limit for CA
];

const MapComponent = () => {
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedState, setSelectedState] = useState("California"); // Default to California
  const [grossSalary, setGrossSalary] = useState(""); // Salary entered by the user
  const [frequency, setFrequency] = useState(""); // Frequency (monthly, yearly, etc.)
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
  const handleDropdownChange = (event) => setSelectedState(event.target.value);
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

    // California state tax calculation (simplified progressive)
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

  const calculateStateTax = (salary, state) => {
    if (state === "California") {
      let tax = 0;
      let lastThreshold = 0;

      for (const bracket of californiaTaxBrackets) {
        if (salary > bracket.threshold) {
          tax += (Math.min(salary, bracket.threshold) - lastThreshold) * bracket.rate;
          lastThreshold = bracket.threshold;
        } else {
          break;
        }
      }
      return tax;
    }
    return 0; // Default to no state tax if state is not California
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
