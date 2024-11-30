// src/components/TaxValue.js
import React from "react";

const TaxValue = ({ value }) => {
  return (
    <div
      style={{
        textAlign: "right", // Align the values to the right
        width: "150px", // Same width for the values to align consistently with the labels
        paddingRight: "100px", // Add some space between the value and the right edge
      }}
    >
      ${value}
    </div>
  );
};

export default TaxValue;
