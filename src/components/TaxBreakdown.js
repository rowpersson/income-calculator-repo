import React from "react";
import TaxLabel from "./TaxLabel";
import TaxValue from "./TaxValue";

// Helper function to format numbers with commas
const formatNumber = (value) => {
  if (typeof value === "number") {
    return value.toLocaleString(); // Adds commas to numbers
  }
  return value; // If the value is not a number, return it as is
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
}) => {
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
            <TaxValue value={marginalTaxRate.toFixed(2) + "%"} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Average Tax Rate" />
            <TaxValue value={averageTaxRate.toFixed(2) + "%"} />
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
