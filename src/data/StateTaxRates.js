// src/components/MapComponent.js
import React, { useState, useEffect } from "react";
import Form from "../components/Form";
import Map from "../components/Map";
import TaxBreakdown from "../components/TaxBreakdown"; // Import the TaxBreakdown component

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// State tax brackets for all 50 states (simplified example)
const stateTaxRates = {
  "Alabama": [
    { rate: 2.0, threshold: 500 },
    { rate: 4.0, threshold: 3000 },
    { rate: 5.0, threshold: 7500 }
  ],
  "Alaska": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Arizona": [
    { rate: 2.59, threshold: 27400 },
    { rate: 3.34, threshold: 54600 },
    { rate: 4.17, threshold: 163100 },
    { rate: 4.50, threshold: 1631000 }
  ],
  "Arkansas": [
    { rate: 2.0, threshold: 4999 },
    { rate: 4.0, threshold: 10000 },
    { rate: 5.0, threshold: 20000 },
    { rate: 6.0, threshold: 40000 },
    { rate: 6.9, threshold: 75000 }
  ],
  "California": [
    { rate: 1.0, threshold: 8932 },
    { rate: 2.0, threshold: 21175 },
    { rate: 4.0, threshold: 33421 },
    { rate: 6.0, threshold: 46394 },
    { rate: 8.0, threshold: 58634 },
    { rate: 9.3, threshold: 299508 },
    { rate: 10.3, threshold: 359407 },
    { rate: 11.3, threshold: 599012 },
    { rate: 13.3, threshold: 1000000 }
  ],
  "Colorado": [
    { rate: 4.55, threshold: 0 }
  ],
  "Connecticut": [
    { rate: 3.0, threshold: 10000 },
    { rate: 5.0, threshold: 50000 },
    { rate: 5.5, threshold: 100000 },
    { rate: 6.0, threshold: 200000 }
  ],
  "Delaware": [
    { rate: 2.2, threshold: 2000 },
    { rate: 3.9, threshold: 5000 },
    { rate: 4.8, threshold: 10000 },
    { rate: 5.2, threshold: 20000 },
    { rate: 5.55, threshold: 250000 }
  ],
  "Florida": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "Georgia": [
    { rate: 1.0, threshold: 750 },
    { rate: 2.0, threshold: 2500 },
    { rate: 3.0, threshold: 7500 },
    { rate: 4.0, threshold: 15000 },
    { rate: 5.0, threshold: 25000 },
    { rate: 5.75, threshold: 75000 }
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
    { rate: 9.0, threshold: 200000 },
    { rate: 11.0, threshold: 1000000 }
  ],
  "Idaho": [
    { rate: 1.125, threshold: 2020 },
    { rate: 3.125, threshold: 4040 },
    { rate: 5.125, threshold: 8090 },
    { rate: 6.125, threshold: 12135 },
    { rate: 7.125, threshold: 15740 }
  ],
  "Illinois": [
    { rate: 4.95, threshold: 0 }
  ],
  "Indiana": [
    { rate: 3.23, threshold: 0 }
  ],
  "Iowa": [
    { rate: 0.33, threshold: 0 },
    { rate: 0.67, threshold: 1250 },
    { rate: 2.25, threshold: 5000 },
    { rate: 4.14, threshold: 11000 },
    { rate: 5.63, threshold: 22000 },
    { rate: 6.96, threshold: 75000 }
  ],
  "Kansas": [
    { rate: 3.1, threshold: 15000 },
    { rate: 5.25, threshold: 30000 },
    { rate: 5.7, threshold: 50000 }
  ],
  "Kentucky": [
    { rate: 5.0, threshold: 0 }
  ],
  "Louisiana": [
    { rate: 2.0, threshold: 1200 },
    { rate: 4.0, threshold: 5000 },
    { rate: 6.0, threshold: 12500 },
    { rate: 6.5, threshold: 50000 }
  ],
  "Maine": [
    { rate: 3.8, threshold: 4219 },
    { rate: 5.8, threshold: 8438 },
    { rate: 6.75, threshold: 12657 },
    { rate: 7.15, threshold: 25314 },
    { rate: 7.95, threshold: 53976 },
    { rate: 8.95, threshold: 80000 }
  ],
  "Maryland": [
    { rate: 2.0, threshold: 1000 },
    { rate: 3.0, threshold: 3000 },
    { rate: 4.0, threshold: 5000 },
    { rate: 4.75, threshold: 10000 },
    { rate: 5.0, threshold: 15000 },
    { rate: 5.75, threshold: 25000 },
    { rate: 6.0, threshold: 30000 }
  ],
  "Massachusetts": [
    { rate: 5.0, threshold: 0 }
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
    { rate: 3.0, threshold: 5000 },
    { rate: 5.0, threshold: 10000 },
    { rate: 5.25, threshold: 25000 }
  ],
  "Missouri": [
    { rate: 1.5, threshold: 0 },
    { rate: 2.0, threshold: 10500 },
    { rate: 2.5, threshold: 25000 },
    { rate: 3.0, threshold: 37500 },
    { rate: 3.5, threshold: 87500 },
    { rate: 4.0, threshold: 100000 }
  ],
  "Montana": [
    { rate: 1.0, threshold: 3400 },
    { rate: 2.0, threshold: 6800 },
    { rate: 3.0, threshold: 10200 },
    { rate: 4.0, threshold: 13600 },
    { rate: 5.0, threshold: 20400 },
    { rate: 6.0, threshold: 27200 },
    { rate: 6.9, threshold: 39800 }
  ],
  "Nebraska": [
    { rate: 2.46, threshold: 3000 },
    { rate: 3.51, threshold: 12000 },
    { rate: 5.01, threshold: 24000 },
    { rate: 6.84, threshold: 79800 }
  ],
  "Nevada": [
    { rate: 0, threshold: 0 } // No state income tax
  ],
  "New Hampshire": [
    { rate: 5.0, threshold: 0 } // Tax on dividends and interest income, no general income tax
  ],
  "New Jersey": [
    { rate: 1.4, threshold: 20000 },
    { rate: 1.75, threshold: 35000 },
    { rate: 3.5, threshold: 40000 },
    { rate: 5.0, threshold: 75000 },
    { rate: 6.37, threshold: 150000 },
    { rate: 8.97, threshold: 500000 }
  ],
  "New Mexico": [
    { rate: 1.7, threshold: 1100 },
    { rate: 3.2, threshold: 4800 },
    { rate: 4.7, threshold: 12400 },
    { rate: 5.9, threshold: 19500 },
    { rate: 6.4, threshold: 32000 }
  ],
  "New York": [
    { rate: 4.0, threshold: 8500 },
    { rate: 4.5, threshold: 11700 },
    { rate: 5.25, threshold: 13900 },
    { rate: 5.9, threshold: 21400 },
    { rate: 6.33, threshold: 80650 },
    { rate: 6.85, threshold: 215400 },
    { rate: 7.65, threshold: 1077550 },
    { rate: 8.82, threshold: 10000000 }
  ],
  "North Carolina": [
    { rate: 5.25, threshold: 0 }
  ],
  "North Dakota": [
    { rate: 1.1, threshold: 3790 },
    { rate: 2.0, threshold: 7550 },
    { rate: 2.9, threshold: 15500 },
    { rate: 3.1, threshold: 23500 },
    { rate: 3.4, threshold: 33500 }
  ],
  "Ohio": [
    { rate: 0.5, threshold: 0 },
    { rate: 1.5, threshold: 5000 },
    { rate: 2.5, threshold: 10000 },
    { rate: 3.5, threshold: 15000 },
    { rate: 4.0, threshold: 22500 }
  ],
  "Oklahoma": [
    { rate: 0.5, threshold: 1000 },
    { rate: 1.0, threshold: 2500 },
    { rate: 2.0, threshold: 5000 },
    { rate: 3.0, threshold: 10000 },
    { rate: 4.0, threshold: 25000 }
  ],
  "Oregon": [
    { rate: 5.0, threshold: 0 },
    { rate: 7.0, threshold: 6500 },
    { rate: 9.0, threshold: 12500 },
    { rate: 9.9, threshold: 250000 }
  ],
  "Pennsylvania": [
    { rate: 3.07, threshold: 0 }
  ],
  "Rhode Island": [
    { rate: 3.75, threshold: 0 },
    { rate: 4.75, threshold: 65900 },
    { rate: 5.99, threshold: 153200 }
  ],
  "South Carolina": [
    { rate: 0.0, threshold: 0 },
    { rate: 3.0, threshold: 3500 },
    { rate: 4.0, threshold: 7000 },
    { rate: 5.0, threshold: 15000 },
    { rate: 6.0, threshold: 25000 },
    { rate: 7.0, threshold: 35000 }
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
    { rate: 3.55, threshold: 40250 },
    { rate: 6.80, threshold: 87750 },
    { rate: 7.80, threshold: 100000 }
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
    { rate: 3.0, threshold: 1000 },
    { rate: 4.0, threshold: 3000 },
    { rate: 4.5, threshold: 5000 },
    { rate: 6.0, threshold: 10000 }
  ],
  "Wisconsin": [
    { rate: 3.54, threshold: 0 },
    { rate: 4.65, threshold: 11890 },
    { rate: 6.27, threshold: 23780 },
    { rate: 7.65, threshold: 263480 }
  ],
  "Wyoming": [
    { rate: 0, threshold: 0 } // No state income tax
  ]
};

export default stateTaxRates;
