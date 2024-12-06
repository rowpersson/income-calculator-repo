// src/data/StateTaxRates.js

// State tax brackets for all 50 states (simplified example)
const stateTaxRates = {
  "Alabama": [
    { rate: 2.0, threshold: 500 },
    { rate: 4.0, threshold: 3000 },
    { rate: 5.0, threshold: 3000 }
  ],
  "Alaska": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Arizona": [
    { rate: 2.50, threshold: 0 }
  ],
  "Arkansas": [
    { rate: 2.0, threshold: 4400 },
    { rate: 4.0, threshold: 8800 },
    { rate: 4.40, threshold: 8800 }
  ],
  "California": [
    { rate: 1.0, threshold: 10412 },
    { rate: 2.0, threshold: 24684 },
    { rate: 4.0, threshold: 38959 },
    { rate: 6.0, threshold: 54081 },
    { rate: 8.0, threshold: 68350 },
    { rate: 9.3, threshold: 349137 },
    { rate: 10.3, threshold: 418961 },
    { rate: 11.3, threshold: 698271 },
    { rate: 12.3, threshold: 1000000 },
    { rate: 13.3, threshold: 1000000 }
  ],
  "Colorado": [
    { rate: 4.40, threshold: 0 }
  ],
  "Connecticut": [
    { rate: 2.0, threshold: 10000 },
    { rate: 4.50, threshold: 50000 },
    { rate: 5.50, threshold: 100000 },
    { rate: 6.00, threshold: 200000 },
    { rate: 6.50, threshold: 250000 },
    { rate: 6.90, threshold: 500000 },
    { rate: 6.99, threshold: 500000 }
  ],
  "Delaware": [
    { rate: 2.2, threshold: 2000 },
    { rate: 3.9, threshold: 5000 },
    { rate: 4.8, threshold: 10000 },
    { rate: 5.2, threshold: 20000 },
    { rate: 5.55, threshold: 25000 },
    { rate: 6.60, threshold: 60000 }
  ],
  "Florida": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Georgia": [
    { rate: 5.49, threshold: 0 }
  ],
  "Hawaii": [
    { rate: 1.4, threshold: 2400 },
    { rate: 3.2, threshold: 4800 },
    { rate: 5.5, threshold: 9600 },
    { rate: 6.4, threshold: 14400 },
    { rate: 6.8, threshold: 19200 },
    { rate: 7.2, threshold: 24000 },
    { rate: 7.6, threshold: 36000 },
    { rate: 7.9, threshold: 48000 },
    { rate: 8.25, threshold: 150000 },
    { rate: 9.0, threshold: 175000 },
    { rate: 10.0, threshold: 200000 },
    { rate: 11.0, threshold: 200000 }
  ],
  "Idaho": [
    { rate: 5.8, threshold: 0 }
  ],
  "Illinois": [
    { rate: 4.95, threshold: 0 }
  ],
  "Indiana": [
    { rate: 3.05, threshold: 0 }
  ],
  "Iowa": [
    { rate: 4.40, threshold: 6210 },
    { rate: 4.82, threshold: 31050 }
  ],
  "Kansas": [
    { rate: 3.1, threshold: 15000 },
    { rate: 5.25, threshold: 30000 },
    { rate: 5.7, threshold: 30000 }
  ],
  "Kentucky": [
    { rate: 4.0, threshold: 0 }
  ],
  "Louisiana": [
    { rate: 1.85, threshold: 12500 },
    { rate: 3.50, threshold: 50000 },
    { rate: 4.25, threshold: 50000 }
  ],
  "Maine": [
    { rate: 5.8, threshold: 26050 },
    { rate: 6.75, threshold: 61600 },
    { rate: 7.15, threshold: 61600 }
  ],
  "Maryland": [
    { rate: 3.0, threshold: 1000 },
    { rate: 4.0, threshold: 2000 },
    { rate: 4.75, threshold: 3000 },
    { rate: 5.00, threshold: 100000 },
    { rate: 5.25, threshold: 125000 },
    { rate: 5.50, threshold: 150000 },
    { rate: 5.75, threshold: 250000 }
  ],
  "Massachusetts": [
    { rate: 5.0, threshold: 1000000 },
    { rate: 9.00, threshold: 1000000 }
  ],
  "Michigan": [
    { rate: 4.25, threshold: 0 }
  ],
  "Minnesota": [
    { rate: 5.35, threshold: 26090 },
    { rate: 6.80, threshold: 52180 },
    { rate: 7.85, threshold: 78170 },
    { rate: 9.85, threshold: 164450 }
  ],
  "Mississippi": [
    { rate: 4.7, threshold: 10000 }
  ],
  "Missouri": [
    { rate: 2.5, threshold: 2546 },
    { rate: 3.0, threshold: 3819 },
    { rate: 3.5, threshold: 5092 },
    { rate: 4.0, threshold: 6365 },
    { rate: 4.5, threshold: 7638 },
    { rate: 4.8, threshold: 8911 }
  ],
  "Montana": [
    { rate: 4.70, threshold: 20500 },
    { rate: 5.90, threshold: 20500 },
  ],
  "Nebraska": [
    { rate: 2.46, threshold: 3700 },
    { rate: 3.51, threshold: 22170 },
    { rate: 5.01, threshold: 35730 },
    { rate: 5.84, threshold: 35730 }
  ],
  "Nevada": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "New Hampshire": [
    { rate: 0, threshold: 0 } // Tax on dividends and interest income, no general income tax
  ],
  "New Jersey": [
    { rate: 1.4, threshold: 20000 },
    { rate: 1.75, threshold: 35000 },
    { rate: 3.5, threshold: 40000 },
    { rate: 5.525, threshold: 75000 },
    { rate: 6.37, threshold: 500000 },
    { rate: 8.97, threshold: 1000000 },
    { rate: 10.75, threshold: 1000000 }
  ],
  "New Mexico": [
    { rate: 1.7, threshold: 5500 },
    { rate: 3.2, threshold: 11000 },
    { rate: 4.70, threshold: 16000 },
    { rate: 4.90, threshold: 210000 },
    { rate: 5.90, threshold: 210000 }
  ],
  "New York": [
    { rate: 4.0, threshold: 8500 },
    { rate: 4.5, threshold: 11700 },
    { rate: 5.25, threshold: 13900 },
    { rate: 5.50, threshold: 80650 },
    { rate: 6.00, threshold: 215400 },
    { rate: 6.85, threshold: 1077550 },
    { rate: 9.65, threshold: 1077550 },
    { rate: 10.30, threshold: 5000000 },
    { rate: 10.90, threshold: 25000000 },
    { rate: 10.90, threshold: 25000000 }
  ],
  "North Carolina": [
    { rate: 4.50, threshold: 0 }
  ],
  "North Dakota": [
    { rate: 1.95, threshold: 44725 },
    { rate: 2.50, threshold: 225975 },
    { rate: 2.50, threshold: 225975 }
  ],
  "Ohio": [
    { rate: 0.00, threshold: 26050 },
    { rate: 2.75, threshold: 92150 },
    { rate: 3.5, threshold: 92150 }
  ],
  "Oklahoma": [
    { rate: 0.25, threshold: 1000 },
    { rate: 0.75, threshold: 2500 },
    { rate: 1.75, threshold: 3750 },
    { rate: 2.75, threshold: 4900 },
    { rate: 3.75, threshold: 7200 },
    { rate: 4.75, threshold: 7200 }
  ],
  "Oregon": [
    { rate: 4.75, threshold: 4300 },
    { rate: 6.75, threshold: 10750 },
    { rate: 8.75, threshold: 125000 },
    { rate: 9.90, threshold: 125000 }
  ],
  "Pennsylvania": [
    { rate: 3.07, threshold: 0 }
  ],
  "Rhode Island": [
    { rate: 3.75, threshold: 77450 },
    { rate: 4.75, threshold: 176050 },
    { rate: 5.99, threshold: 176050 }
  ],
  "South Carolina": [
    { rate: 0, threshold: 3460 },
    { rate: 3.00, threshold: 17330 },
    { rate: 6.40, threshold: 17330 }
  ],
  "South Dakota": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Tennessee": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Texas": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Utah": [
    { rate: 4.95, threshold: 0 }
  ],
  "Vermont": [
    { rate: 3.35, threshold: 45400 },
    { rate: 6.60, threshold: 110050 },
    { rate: 7.60, threshold: 229550 },
    { rate: 8.75, threshold: 229550 }
  ],
  "Virginia": [
    { rate: 2.0, threshold: 3000 },
    { rate: 3.0, threshold: 5000 },
    { rate: 5.0, threshold: 17000 },
    { rate: 5.75, threshold: 20000 }
  ],
  "Washington": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "West Virginia": [
    { rate: 2.36, threshold: 10000 },
    { rate: 3.15, threshold: 25000 },
    { rate: 3.54, threshold: 40000 },
    { rate: 4.72, threshold: 60000 },
    { rate: 5.12, threshold: 60000 }
  ],
  "Wisconsin": [
    { rate: 3.50, threshold: 14320 },
    { rate: 4.40, threshold: 28640 },
    { rate: 5.30, threshold: 315310 },
    { rate: 7.65, threshold: 315310 }
  ],
  "Wyoming": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Washington DC": [
    { rate: 4.00, threshold: 10000 },
    { rate: 6.00, threshold: 40000 },
    { rate: 6.50, threshold: 60000 },
    { rate: 8.50, threshold: 250000 },
    { rate: 9.25, threshold: 500000 },
    { rate: 9.75, threshold: 1000000 }
  ],
};

export default stateTaxRates;
