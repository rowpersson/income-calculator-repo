// src/components/TaxLabel.js
import React from "react";

const TaxLabel = ({ label }) => {
  return (
    <div
      style={{
        fontWeight: "bold",
        textAlign: "left",
        width: "200px", // Fixed width for all labels
        paddingLeft: "20px", // Padding for label to keep space consistent
        marginBottom: "10px", // Adds space between rows of labels
        whiteSpace: "nowrap", // Prevents wrapping of text
      }}
    >
      {label}
    </div>
  );
};

export default TaxLabel;