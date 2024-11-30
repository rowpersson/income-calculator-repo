// src/components/TaxLabel.js
import React from "react";

const TaxLabel = ({ label }) => {
  return (
    <div
      style={{
        fontWeight: "bold",
        textAlign: "left",
        width: "150px", // Fixed width for all labels
        paddingLeft: "20px", // Padding for label to keep space consistent
        marginBottom: "10px", // Adds space between rows of labels
      }}
    >
      {label}
    </div>
  );
};

export default TaxLabel;
