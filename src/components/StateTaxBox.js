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
          width: '300px',
          maxWidth: '100%',
          height: '150px',
          overflowY: 'auto',
          fontSize: '14px',
          fontWeight: 'bold',
        }}
      >
        <p>State Tax Information for: {selectedState}</p>
      </div>
    );
  }

  // Check if all tax brackets have the same rate (flat tax)
  const isFlatTax = stateInfo.every(bracket => bracket.rate === stateInfo[0].rate);

  return (
    <div
      style={{
        padding: '5px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '1px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        //marginTop: '20px',
        width: '300px',
        maxWidth: '100%',
        height: 'auto',
        overflowY: 'auto',
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    >
      <h4 style={{ marginTop: '0px' }}>State Tax Information for: {selectedState}</h4>
      
      <ul style={{ marginTop: '0px' }}>
        {/* If it's a flat tax, display just the rate */}
        {isFlatTax ? (
          <li>
            <strong>{stateInfo[0].rate}% tax rate</strong>
          </li>
        ) : (
          // Otherwise, display the brackets as usual with clarification for the last bracket
          stateInfo.map((bracket, index) => {
            const isLastBracket = index === stateInfo.length - 1;
            
            if (isLastBracket) {
              // For the last bracket, don't show the "Up to" part, only "and above"
              return (
                <li key={index}>
                  <strong>${bracket.threshold.toLocaleString()} and above:</strong> {bracket.rate}% tax rate
                </li>
              );
            }

            return (
              <li key={index}>
                <strong>Up to ${bracket.threshold.toLocaleString()}:</strong> {bracket.rate}% tax rate
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default StateTaxBox;
