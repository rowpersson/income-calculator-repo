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
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Withholding Breakdown</h2>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Salary */}
          <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}>
            <TaxLabel label="Salary" />
            <TaxValue value={formatNumber(salary)} />
          </div>
          
          {/* Horizontal Bar Under 401k deduction */}
          <div style={{ width: "100%", height: "2px", backgroundColor: "#000", margin: "10px 0" }}></div>          
          {/* Traditional 401k */}
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="- 401k Contribution (Pre-tax)" />
            <TaxValue value={formatNumber(preTax401k)} />
          </div>

          {/* Horizontal Bar Under 401k deduction */}
          <div style={{ width: "100%", height: "2px", backgroundColor: "#000", margin: "10px 0" }}></div>

          {/* Taxes */}
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="- Federal Income Tax" />
            <TaxValue value={formatNumber(federalTax)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="- State Income Tax" />
            <TaxValue value={formatNumber(stateTax)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="- Social Security" />
            <TaxValue value={formatNumber(socialSecurity)} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="- Medicare" />
            <TaxValue value={formatNumber(medicare)} />
          </div>

          {/* Horizontal Bar Above Total Tax */}
          <div style={{ width: "100%", height: "2px", backgroundColor: "#000", margin: "10px 0" }}></div>

          {/* Total Tax */}
          <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
            <TaxLabel label="Total Tax" />
            <TaxValue value={formatNumber(totalTax)} />
          </div>

          {/* Horizontal Bar After Total Tax */}
          <div style={{ width: "100%", height: "2px", backgroundColor: "#000", margin: "10px 0" }}></div>

          {/* 401k Contributions */}
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="- 401k Contribution (Roth)" />
            <TaxValue value={formatNumber(rothContribution)} />
          </div>

          {/* Horizontal Bar After 401k */}
          <div style={{ width: "100%", height: "2px", backgroundColor: "#000", margin: "10px 0" }}></div>

          {/* Net Pay */}
          <div style={{ display: "flex", width: "100%", fontWeight: "bold" }}>
            <TaxLabel label="Net Pay" />
            <TaxValue value={formatNumber(netPay)} />
          </div>

          {/* Tax Rates */}
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Average Tax Rate" />
            <TaxValue value={formatPercentage(averageTaxRate)} />
          </div>
        </div>
      </div>

      {/* Optional: Additional Component Box */}
      <div
        style={{
          width: "48%",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Additional Info</h2>
        <div>
          <p>Other related information can go here.</p>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdown;
