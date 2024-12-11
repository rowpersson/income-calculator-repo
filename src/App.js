// src/App.js

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapComponent from "./components/MapComponent";  
import TaxInfoPage from "./components/TaxInfoPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapComponent />} />
        <Route path="/tax-information" element={<TaxInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
