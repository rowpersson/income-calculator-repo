import React from "react";
import TaxLabel from "./TaxLabel";
import TaxValue from "./TaxValue";

const TaxBreakdown = () => {
  const breakdown = {
    salary: 200000,
    federalIncomeTax: 40088,
    stateIncomeTax: 12578,
    socialSecurity: 9114,
    medicare: 2900,
    sdi: 31.2,
    fli: 424,
    totalTax: 65135,
    netPay: 134865,
    marginalTaxRate: 45.0,
    averageTaxRate: 32.6,
  };

  return (
    <div
      style={{
        display: "flex", // Set display to flex for side-by-side layout
        justifyContent: "space-between", // This ensures the two components are spaced apart
        width: "100%", // Make the entire container take full width
        padding: "20px", // Padding for the container
        marginTop: "-350px", // Adjust the top margin if necessary
      }}
    >
      {/* Withholding Box */}
      <div
        style={{
          width: "48%", // Box takes up ~50% of the container
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Withholding</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Salary" />
            <TaxValue value={breakdown.salary} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Federal Income Tax" />
            <TaxValue value={breakdown.federalIncomeTax} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="State Income Tax" />
            <TaxValue value={breakdown.stateIncomeTax} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Social Security" />
            <TaxValue value={breakdown.socialSecurity} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Medicare" />
            <TaxValue value={breakdown.medicare} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="SDI (State Disability Insurance)" />
            <TaxValue value={breakdown.sdi} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="FLI (Family Leave Insurance)" />
            <TaxValue value={breakdown.fli} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Total Tax" />
            <TaxValue value={breakdown.totalTax} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Net Pay" />
            <TaxValue value={breakdown.netPay} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Marginal Tax Rate" />
            <TaxValue value={breakdown.marginalTaxRate + "%"} />
          </div>
          <div style={{ display: "flex", width: "100%" }}>
            <TaxLabel label="Average Tax Rate" />
            <TaxValue value={breakdown.averageTaxRate + "%"} />
          </div>
        </div>
      </div>

      {/* Another Component Box */}
      <div
        style={{
          width: "48%", // Another box taking up ~50% of the container
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Another Component</h2>
        <div>
          {/* Add content for the second component here */}
          <p>Content for another box can go here.</p>
        </div>
      </div>
    </div>
  );
};

export default TaxBreakdown;
