import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { ordersData } from "./ordersData";
import ReportsTable from "./ReportsTable";
// import { DataGrid } from "@mui/x-data-grid";

// const ReportsTable = ({ reportResults }) => {
//   const columns = [
//     { field: "id", headerName: "ID", width: 100 },
//     { field: "period", headerName: "Period", width: 200 },
//     { field: "customerName", headerName: "Customer Name", width: 200 },
//     { field: "orderCount", headerName: "Order Count", width: 150 },
//   ];

//   const rows = reportResults.flatMap((report) =>
//     report.customerCounts.map((customer, index) => ({
//       id: `${report.period}-${index}`,
//       period: report.period,
//       customerName: customer.customerName,
//       orderCount: customer.orderCount,
//     }))
//   );

//   return (
//     <div style={{ height: 400, width: "100%" }}>
//       <DataGrid rows={rows} columns={columns} />
//     </div>
//   );
// };

export default function Reports() {
  const [inputValue, setInputValue] = useState("weekly");
  const [reportResults, setReportResults] = useState([]);
  const [duplicateCustomers, setDuplicateCustomers] = useState([]);
  const [duplicateAddresses, setDuplicateAddresses] = useState([]);

  useEffect(() => {
    if (inputValue === "weekly") {
      generateWeeklyReports();
    } else if (inputValue === "monthly") {
      generateMonthlyReports();
    }
    findDuplicateCustomers();
  }, [inputValue]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
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

  const generateMonthlyReports = () => {
    const startDate = new Date("2023-04-01"); // Set the desired starting date in the format "YYYY-MM-DD"
    const currentDate = new Date();
    const monthlyResults = {};

    const datesInRange = [];

    // Generate an array of all dates within the range, including previous months
    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();

    while (
      currentYear < currentDate.getFullYear() ||
      (currentYear === currentDate.getFullYear() &&
        currentMonth <= currentDate.getMonth())
    ) {
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      datesInRange.push({ firstDay: firstDayOfMonth, lastDay: lastDayOfMonth });

      // Move to the next month
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
    }

    datesInRange.forEach(({ firstDay, lastDay }) => {
      const monthStart = new Date(firstDay);
      const monthEnd = new Date(lastDay);
      const monthRange = `${formatDate(monthStart)} - ${formatDate(monthEnd)}`;

      monthlyResults[monthRange] = {};

      // Initialize order count to 0 for all customer names
      ordersData.forEach((order) => {
        const customerName = order["Customer Name"];
        monthlyResults[monthRange][customerName] = 0;
      });

      ordersData.forEach((order) => {
        const orderDate = new Date(order["Order Date"]);

        if (orderDate >= firstDay && orderDate <= lastDay) {
          const customerName = order["Customer Name"];
          monthlyResults[monthRange][customerName] += 1;
        }
      });
    });

    const formattedResults = Object.entries(monthlyResults).map(
      ([monthRange, customerData]) => ({
        period: monthRange,
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

  const findDuplicateCustomers = () => {
    const mobileNumbersMap = new Map();
    const addressesMap = new Map();

    ordersData.forEach((order) => {
      const mobileNumber = order["Mobile Number"];
      const address = order["Address"];
      const customerID = order["Customer ID"];

      if (!mobileNumbersMap.has(mobileNumber)) {
        mobileNumbersMap.set(mobileNumber, []);
      }

      mobileNumbersMap.get(mobileNumber).push(customerID);

      if (!addressesMap.has(address)) {
        addressesMap.set(address, []);
      }

      addressesMap.get(address).push(customerID);
    });

    const duplicateMobileNumbers = Array.from(mobileNumbersMap)
      .filter(([_, customerIDs]) => customerIDs.length > 1)
      .map(([mobileNumber, customerIDs]) => ({
        mobileNumber,
        customerIDs,
      }));

    const duplicateAddressesList = Array.from(addressesMap)
      .filter(([_, customerIDs]) => customerIDs.length > 1)
      .map(([address, customerIDs]) => ({
        address,
        customerIDs,
      }));

    setDuplicateCustomers(duplicateMobileNumbers);
    setDuplicateAddresses(duplicateAddressesList);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Tabs value={inputValue} onChange={handleInputChange}>
            <Tab value="weekly" label="Weekly Reports" />
            <Tab value="monthly" label="Monthly Reports" />
          </Tabs>
        </Toolbar>
      </AppBar>
      {/* <ReportsTable reportResults={reportResults} /> */}
      <ReportsTable reportResults={reportResults} />
      <div>
        <h2>Duplicate Customers</h2>
        <h3>Duplicate Mobile Numbers</h3>
        <ul>
          {duplicateCustomers.map((customer, index) => (
            <li key={index}>
              Mobile Number: {customer.mobileNumber}, Customers:{" "}
              {customer.customerIDs.join(", ")}
            </li>
          ))}
        </ul>
        <h3>Duplicate Addresses</h3>
        <ul>
          {duplicateAddresses.map((address, index) => (
            <li key={index}>
              Address: {address.address}, Customers:{" "}
              {address.customerIDs.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
