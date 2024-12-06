// TaxInfo.js

const federalTaxBreakdown = [
    { range: "Up to $10,275", rate: "10%" },
    { range: "$10,276 to $41,775", rate: "12%" },
    { range: "$41,776 to $89,075", rate: "22%" },
    { range: "$89,076 to $170,050", rate: "24%" },
    { range: "$170,051 to $215,950", rate: "32%" },
    { range: "$215,951 to $539,900", rate: "35%" },
    { range: "Over $539,901", rate: "37%" },
  ];
  
  const averageTaxRateDefinition = `
    The Average Tax Rate is the total amount of taxes paid divided by your gross income, expressed as a percentage. It is a way to show the overall burden of taxes on your income. For example, if your gross income is $100,000 and you pay $20,000 in taxes, your average tax rate would be 20%.
  `;

  const contributionDefinition = `
    A traditional 401(k) withdrawals income before tax, meaning the total taxable income is brought down. The individual will pay taxes when accessing this money in the future.\n   
    A Roth 401(k) withdrawals income after tax, meaning the individual will pay taxes in the present, and not the future.\n
    It is worth considering which type of 401(k) will be financially advantageous depending on an invidual's current and predicted future income tax bracket.\n
  `;

  const textBoxNote = `
  *** Note ***<br><br>
  This calculator is designed to formulate an individual's withholdings per paycheck, and should not be used for calculating tax returns.<br><br>
  The following are not included in the formula:<br>
  <ul>
    <li>Itemized or standardized deductions</li>
    <li>Capital losses/gains taxes</li>
    <li>Local city taxes</li>
    <li>Health Savings Account (HSA) deductions</li>
  </ul>
`;
  
  export { federalTaxBreakdown, averageTaxRateDefinition, contributionDefinition, textBoxNote };
  