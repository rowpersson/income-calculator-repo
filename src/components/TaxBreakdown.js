import React from "react";
import TaxLabel from "./TaxLabel";
import TaxValue from "./TaxValue";

// Helper function to format numbers with commas
const formatNumber = (value) => {
  if (typeof value === "number" && !isNaN(value)) {
    return value.toLocaleString(); // Adds commas to numbers if valid
  }
  return "___"; // Fallback if the value is not a valid number
};

const TaxBreakdown = ({
  salary,
  federalTax,
  stateTax,
  socialSecurity,
  medicare,
  totalTax,
  netPay,
  marginalTaxRate,
  averageTaxRate,
  rothContribution, // Add rothContribution prop
  preTax401k, // Add preTax401k prop
}) => {
  // Function to safely handle the tax rates and format them correctly
  const formatPercentage = (value) => {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toFixed(2) + "%"; // Only format if it's a valid number
    }
    return "___"; // Return a placeholder if the value is invalid or missing
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        padding: "20px",
        marginTop: "-350px",
      }}
    >
      {/* Withholding Box */}
      <div
        style={{
          width: "48%",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Withholding</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Salary" />
            <TaxValue value={formatNumber(salary)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Federal Income Tax" />
            <TaxValue value={formatNumber(federalTax)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="State Income Tax" />
            <TaxValue value={formatNumber(stateTax)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Social Security" />
            <TaxValue value={formatNumber(socialSecurity)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Medicare" />
            <TaxValue value={formatNumber(medicare)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Total Tax" />
            <TaxValue value={formatNumber(totalTax)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Net Pay" />
            <TaxValue value={formatNumber(netPay)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Marginal Tax Rate" />
            <TaxValue value={formatPercentage(marginalTaxRate)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Average Tax Rate" />
            <TaxValue value={formatPercentage(averageTaxRate)} />
          </div>
          {/* Add Pre-tax 401k and Roth Contribution to the breakdown */}
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="401k Contribution (Pre-tax)" />
            <TaxValue value={formatNumber(preTax401k)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="401k Contribution (Roth)" />
            <TaxValue value={formatNumber(rothContribution)} />
          </div>
        </div>
      </div>

      {/* Another Component Box */}
      <div
        style={{
          width: "48%",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Another Component</h2>
        <div>
          {/* Add content for another box here */}
          <p>Content for another box can go here.</p>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdown;
