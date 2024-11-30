// src/components/TaxBreakdown.js
import React from "react";
import TaxLabel from "./TaxLabel";
import TaxValue from "./TaxValue";

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
            <TaxValue value={salary} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Federal Income Tax" />
            <TaxValue value={federalTax} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="State Income Tax" />
            <TaxValue value={stateTax} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Social Security" />
            <TaxValue value={socialSecurity} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Medicare" />
            <TaxValue value={medicare} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Total Tax" />
            <TaxValue value={totalTax} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Net Pay" />
            <TaxValue value={netPay} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Marginal Tax Rate" />
            <TaxValue value={marginalTaxRate + "%"} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Average Tax Rate" />
            <TaxValue value={averageTaxRate + "%"} />
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