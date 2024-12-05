import React from 'react';
import stateTaxRates from '../data/StateTaxRates';

const StateTaxBox = ({ selectedState }) => {
  const stateInfo = stateTaxRates[selectedState];

  if (!stateInfo) {
    return (
      <div
        style={{
          padding: '5px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          marginTop: '20px', // Ensure there's space above
          width: '300px', // Fixed width (thinner box)
          maxWidth: '100%', // Ensure it doesn't stretch beyond the container
          height: '150px', // Fixed height for the box
          overflowY: 'auto', // Enable vertical scroll if content overflows
          fontSize: '14px', // Consistent font size
          fontWeight: 'bold', // Bold text for all content
        }}
      >
        <p>State Tax Information for: {selectedState}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '5px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '1px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        marginTop: '20px', // Ensure there's space above
        width: '300px', // Fixed width (thinner box)
        maxWidth: '100%', // Ensure it doesn't stretch beyond the container
        height: '180px', // Fixed height for the box
        overflowY: 'auto', // Enable vertical scroll if content overflows
        fontSize: '14px', // Consistent font size
        fontWeight: 'bold', // Bold text for all content
      }}
    >
      <h4 style={{ marginTop: '0px' }}>State Tax Information for: {selectedState}</h4> {/* Move title closer to the top */}
      <ul style={{ marginTop: '0px' }}> {/* Reduce space between title and list */}
        {stateInfo.map((bracket, index) => (
          <li key={index}>
            <strong>Up to ${bracket.threshold.toLocaleString()}:</strong> {bracket.rate}% tax rate
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StateTaxBox;
