import React from "react";

const TaxValue = ({ value }) => {
  const isPercentage = value.includes("%"); // Check if the value contains a "%" sign
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value; // Format numbers with commas

  return (
    <div
      style={{
        textAlign: "right", // Align the values to the right
        width: "150px", // Same width for the values to align consistently with the labels
        paddingRight: "200px", // Add some space between the value and the right edge
      }}
    >
      {/* If the value is a percentage, display it without the dollar sign */}
      {isPercentage ? formattedValue : `$${formattedValue}`} 
    </div>
  );
};

export default TaxValue;
