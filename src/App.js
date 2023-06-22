import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";

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
