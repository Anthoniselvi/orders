import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./Dashboard";
import GetReports from "./GetReports";
import ExcelUploader from "./ExcelUploader";
import Orders from "./Orders";

function App() {
  const [ordersData, setOrdersData] = useState([]);

  return (
    <div className="App">
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={<Dashboard setOrdersData={setOrdersData} />}
            />
            <Route
              path="/upload"
              element={<ExcelUploader setOrdersData={setOrdersData} />}
            />
            <Route
              path="/orders"
              element={<Orders ordersData={ordersData} />}
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
