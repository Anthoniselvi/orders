import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { ordersData } from "./ordersData";
import ReportsTable from "./ReportsTable";
import DuplicatesTable from "./DuplicatesTable";

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
    } else if (inputValue === "all") {
      generateAllReports();
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

  const formatDateRange = (startDate, endDate) => {
    const startDay = startDate.getDate();
    const startMonth = startDate.getMonth() + 1;
    const endDay = endDate.getDate();
    const endMonth = endDate.getMonth() + 1;

    return `${startDay.toString().padStart(2, "0")}.${startMonth
      .toString()
      .padStart(2, "0")} - ${endDay.toString().padStart(2, "0")}.${endMonth
      .toString()
      .padStart(2, "0")}`;
  };

  const formatMonthRange = (startDate, endDate) => {
    const startDay = startDate.getDate().toString().padStart(2, "0");
    const startMonth = (startDate.getMonth() + 1).toString().padStart(2, "0");
    const endDay = endDate.getDate().toString().padStart(2, "0");
    const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");

    return `${startDay}.${startMonth}-${endDay}.${endMonth}`;
  };

  const generateAllReports = () => {
    const allResults = {};

    // Initialize order count and customer ID for all customer names
    ordersData.forEach((order) => {
      const customerName = order["Customer Name"];
      allResults[customerName] = {
        orderCount: 0,
        customerID: order["Customer ID"], // Include customerID field
      };
    });

    ordersData.forEach((order) => {
      const customerName = order["Customer Name"];
      allResults[customerName].orderCount += 1;
    });

    const formattedResults = [
      {
        period: "All",
        customerCounts: Object.entries(allResults).map(
          ([customerName, { orderCount, customerID }]) => ({
            customerName,
            orderCount,
            customerID, // Include customerID field
          })
        ),
      },
    ];

    setReportResults(formattedResults);
  };

  const generateWeeklyReports = () => {
    const startDate = new Date("2023-04-01");
    startDate.setDate(startDate.getDate() + (7 - startDate.getDay()));
    const currentDate = new Date();
    const weeklyResults = {};

    const datesInRange = [];

    while (startDate <= currentDate) {
      datesInRange.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 7);
    }

    datesInRange.reverse();

    datesInRange.forEach((date) => {
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      const weekRange = formatDateRange(weekStart, weekEnd);

      weeklyResults[weekRange] = {};

      // Initialize order count to 0 for all customer names
      ordersData.forEach((order) => {
        const customerID = order["Customer ID"];
        const customerName = order["Customer Name"];
        weeklyResults[weekRange][customerID] = {
          customerName,
          orderCount: 0,
        };
      });

      ordersData.forEach((order) => {
        const orderDate = new Date(order["Order Date"]);

        if (orderDate >= weekStart && orderDate <= weekEnd) {
          const customerID = order["Customer ID"];
          const customerName = order["Customer Name"];
          weeklyResults[weekRange][customerID].orderCount += 1;
        }
      });
    });

    const formattedResults = Object.entries(weeklyResults).map(
      ([weekRange, customerData]) => ({
        period: weekRange,
        customerCounts: Object.entries(customerData).map(
          ([customerID, { customerName, orderCount }]) => ({
            customerID,
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
      const monthRange = formatMonthRange(monthStart, monthEnd);

      monthlyResults[monthRange] = {};

      // Initialize order count to 0 for all customer names
      ordersData.forEach((order) => {
        const customerName = order["Customer Name"];
        monthlyResults[monthRange][customerName] = {
          orderCount: 0,
          customerID: order["Customer ID"], // Include customerID field
        };
      });

      ordersData.forEach((order) => {
        const orderDate = new Date(order["Order Date"]);

        if (orderDate >= firstDay && orderDate <= lastDay) {
          const customerName = order["Customer Name"];
          monthlyResults[monthRange][customerName].orderCount += 1;
        }
      });
    });

    const formattedResults = Object.entries(monthlyResults).map(
      ([monthRange, customerData]) => ({
        period: monthRange,
        customerCounts: Object.entries(customerData).map(
          ([customerName, { orderCount, customerID }]) => ({
            customerName,
            orderCount,
            customerID, // Include customerID field
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
      const customerName = order["Customer Name"];

      if (!mobileNumbersMap.has(mobileNumber)) {
        mobileNumbersMap.set(mobileNumber, []);
      }

      mobileNumbersMap.get(mobileNumber).push({ customerID, customerName });

      if (!addressesMap.has(address)) {
        addressesMap.set(address, []);
      }

      addressesMap.get(address).push({ customerID, customerName });
    });

    const duplicateMobileNumbers = Array.from(mobileNumbersMap)
      .filter(([_, customers]) => customers.length > 1)
      .map(([mobileNumber, customers]) => ({
        mobileNumber,
        customers,
      }));

    const duplicateAddressesList = Array.from(addressesMap)
      .filter(([_, customers]) => customers.length > 1)
      .map(([address, customers]) => ({
        address,
        customers,
      }));

    setDuplicateCustomers(duplicateMobileNumbers);
    setDuplicateAddresses(duplicateAddressesList);
  };

  return (
    <div style={{ display: "flex", width: "calc(100vw - 250px)" }}>
      <div style={{ width: "100%", display: "flex", gap: "5%" }}>
        <div style={{ width: "60%", border: "1px solid #C9C9C9" }}>
          <AppBar position="static" sx={{ background: "none" }}>
            <Toolbar>
              <Tabs value={inputValue} onChange={handleInputChange}>
                <Tab value="all" label="All" />
                <Tab value="weekly" label="Weekly Reports" />
                <Tab value="monthly" label="Monthly Reports" />
              </Tabs>
            </Toolbar>
          </AppBar>
          {/* <ReportsTable reportResults={reportResults} /> */}
          <ReportsTable reportResults={reportResults} />
        </div>
        <div style={{ width: "30%" }}>
          <DuplicatesTable
            duplicateCustomers={duplicateCustomers}
            duplicateAddresses={duplicateAddresses}
          />
        </div>
      </div>
    </div>
  );
}
