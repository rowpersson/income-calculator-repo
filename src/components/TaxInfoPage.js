import { Link } from "react-router-dom";  // Import the Link component for navigation

function TaxInfoPage() {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "1400px", // Max width to keep it readable on large screens
        margin: "0 auto", // Center the page
        backgroundColor: "#ffffff", // Background color for the page
        borderRadius: "8px", // Rounded corners
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
      }}
    >
      {/* Horizontal Banner */}
      <div
        style={{
          width: "100%", // Full width of the page
          height: "50px", // Set a fixed height for the banner
          backgroundColor: "#2980b9", // Color for the banner (change to any color)
          display: "flex",
          justifyContent: "center", // Center content horizontally
          alignItems: "center", // Center content vertically
          color: "#fff", // White text color
          fontWeight: "bold", // Make the text bold
        }}
      >
        {/* First Button: Home */}
        <Link to="/">
          <button
            onClick={() => console.log("Home button clicked")}
            style={{
              backgroundColor: "#fff",
              color: "#2980b9",
              padding: "8px 30px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
              marginRight: "10px",
            }}
          >
            Calculator Home
          </button>
        </Link>

        {/* Second Button: Link to Another Page */}
        <button
          style={{
            backgroundColor: "#fff",
            color: "#2980b9",
            padding: "8px 16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "5px",
          }}
        >
          Additional Tax Information
        </button>
      </div>

      <h1
        style={{
          textAlign: "center",
          color: "#2c3e50",
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "0px",
        }}
      >
        Additional Tax Information Overview
      </h1>

      {/* Sub-title */}
      <h3
        style={{
          textAlign: "center",
          fontSize: "18px",
          marginBottom: "0px",
          fontWeight: "bold",
          color: "#7f8c8d", // Soft gray for subheading
        }}
      >
        Some extra details about how taxes work within the United States.
      </h3>

      {/* Tax Information Sections */}
      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9", // Blue color for section headings
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Other Taxable Income
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Interest Income–Most interest will be taxed as ordinary income, including interest earned on checking and savings accounts, CDs, and income tax refunds. However, there are certain exceptions, such as municipal bond interest and private-activity bonds.
          </p>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Short Term Capital Gains/Losses–Profit or loss from the sale of assets held for less than one year. It is taxed as normal income.
          </p>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Long Term Capital Gains/Losses–Profit or loss from the sale of assets held for one year or longer. Taxation rules applied are determined by the ordinary income marginal tax rate.
          </p>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Ordinary Dividends–All dividends should be considered ordinary unless specifically classified as qualified. Ordinary dividends are taxed as normal income.
          </p>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Qualified Dividends–These are taxed at the same rate as long-term capital gains, which is lower than that of ordinary dividends. There are many stringent measures in place for dividends to be legally defined as qualified.
          </p>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Passive Incomes–Making the distinction between passive and active income is important because taxpayers can claim passive losses. Passive income generally comes from two places, rental properties or businesses that don't require material participation. Any excessive passive income loss can be accrued until used or deducted in the year the taxpayer disposes of the passive activity in a taxable transaction.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9",
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Exemptions
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Broadly speaking, tax exemptions are monetary exemptions with the aim of reducing or even entirely eliminating taxable income. They do not only apply to personal income tax; for instance, charities and religious organizations are generally exempt from taxation.
          </p>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            In some international airports, tax-exempt shopping in the form of duty-free shops is available. Other examples include state and local governments not being subject to federal income taxes.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9",
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Tax Deductions
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Tax deductions arise from expenses. They help lower tax bills by reducing the percentage of adjusted gross income that is subject to taxes. There are two types of deductions: above-the-line (ATL) and below-the-line (BTL) itemized deductions.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9",
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Modified Adjusted Gross Income (MAGI)
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            MAGI is used to determine whether a taxpayer is qualified for certain tax deductions. It is simply AGI with some deductions added back in. These deductions include:
          </p>
          <ul style={{ fontSize: "16px", color: "#7f8c8d", marginLeft: "20px" }}>
            <li>Student loan interest</li>
            <li>One-half of self-employment tax</li>
            <li>Qualified tuition expenses</li>
            <li>Tuition and fees deduction</li>
            <li>Passive loss or passive income</li>
            <li>IRA contributions, taxable Social Security payments</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9",
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Above-the-line Deductions
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            ATL deductions lower AGI, which means less income to pay taxes on. They include expenses that are claimed on Schedules C, D, E, and F, and "Adjustments to Income." One advantage of ATL deductions is that they are allowed under the alternative minimum tax.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9",
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Tax Credits
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            Tax credits directly reduce the amount of tax owed, making them more effective than deductions. Examples include:
          </p>
          <ul style={{ fontSize: "16px", color: "#7f8c8d", marginLeft: "20px" }}>
            <li>Earned Income Tax Credit</li>
            <li>Child Tax Credit</li>
            <li>Saver's Credit</li>
            <li>American Opportunity Credit</li>
            <li>Lifetime Learning Credit</li>
          </ul>
        </div>
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "600",
            color: "#2980b9",
            marginBottom: "10px",
            marginLeft: "200px", // Add left margin for alignment
          }}
        >
          Alternative Minimum Tax (AMT)
        </h2>
        <div style={{ maxWidth: "1000px", width: "66.66%", margin: "0 auto" }}>
          <p style={{ lineHeight: "1.6", fontSize: "16px", color: "#7f8c8d" }}>
            The AMT is a mandatory alternative to the standard income tax. Taxpayers must pay the higher of the AMT or their standard income tax if their adjusted gross income exceeds the AMT exemption amount.
          </p>
        </div>
      </section>
    </div>
  );
}

export default TaxInfoPage;
