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
      {isPercentage ? formattedValue : `$${formattedValue}`} {/* Display without $ for percentages */}
    </div>
  );
};

export default TaxValue;
