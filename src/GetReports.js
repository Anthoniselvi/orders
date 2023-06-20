import React, { useState } from "react";
import { ordersData } from "./ordersData";

export default function GetReports() {
  const [inputValue, setInputValue] = useState("");
  const [reportResults, setReportResults] = useState([]);

  const handleInputChange = (e) => {
    const selectedValue = e.target.value;
    setInputValue(selectedValue);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return day + "." + month + "." + year;
  };

  const generateWeeklyReports = () => {
    const startDate = new Date("2023-04-01"); // Set the desired starting date in the format "YYYY-MM-DD"
    startDate.setDate(startDate.getDate() + (7 - startDate.getDay())); // Set the start date as the first Sunday of the week
    const currentDate = new Date();
    const weeklyResults = {};

    const datesInRange = [];

    // Generate an array of all dates within the range, including previous months
    while (startDate <= currentDate) {
      datesInRange.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 7); // Move to the next Sunday
    }

    // Reverse the datesInRange array to display results in reverse order
    datesInRange.reverse();

    datesInRange.forEach((date) => {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Get the start date of the week

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6); // Get the end date of the week

      const weekRange = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

      weeklyResults[weekRange] = {};

      // Initialize order count to 0 for all customer names
      ordersData.forEach((order) => {
        const customerName = order["Customer Name"];
        weeklyResults[weekRange][customerName] = 0;
      });

      ordersData.forEach((order) => {
        const orderDate = new Date(order["Order Date"]);

        if (orderDate >= weekStart && orderDate <= weekEnd) {
          const customerName = order["Customer Name"];
          weeklyResults[weekRange][customerName] += 1;
        }
      });
    });

    const formattedResults = Object.entries(weeklyResults).map(
      ([weekRange, customerData]) => ({
        period: weekRange,
        customerCounts: Object.entries(customerData).map(
          ([customerName, orderCount]) => ({
            customerName,
            orderCount,
          })
        ),
      })
    );

    setReportResults(formattedResults);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue === "weekly") {
      generateWeeklyReports();
    } else {
      setReportResults([]); // Clear the report results if no option is selected
    }
  };

  const getAllCustomerNames = (reportResults) => {
    const customerNames = {};
    reportResults.forEach((result) => {
      result.customerCounts.forEach((customerData) => {
        const customerName = customerData.customerName;
        customerNames[customerName] = true;
      });
    });
    return customerNames;
  };

  const getOrderCountForCustomer = (customerCounts, customerName) => {
    const customerData = customerCounts.find(
      (customer) => customer.customerName === customerName
    );
    return customerData ? customerData.orderCount : 0;
  };

  return (
    <div>
      <h1>Reports</h1>
      <form onSubmit={handleSubmit}>
        <select
          name="inputValue"
          value={inputValue}
          onChange={handleInputChange}
        >
          <option value="">Select an option</option>
          <option value="weekly">Weekly</option>
        </select>
        <button type="submit">Submit</button>
      </form>
      {reportResults.length > 0 && (
        <div>
          <h2>Report Results:</h2>
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                {reportResults.map((result, index) => (
                  <th key={index}>{result.period}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(getAllCustomerNames(reportResults)).map(
                (customerName, index) => (
                  <tr key={index}>
                    <td>{customerName}</td>
                    {reportResults.map((result, index) => (
                      <td key={index}>
                        {getOrderCountForCustomer(
                          result.customerCounts,
                          customerName
                        )}
                      </td>
                    ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
