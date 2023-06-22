import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function ReportsTable({ reportResults }) {
  const periods = reportResults.map((report) => report.period);
  const columns = [
    { field: "customerID", headerName: "Customer ID", width: 150 },
    {
      field: "customerName",
      headerName: "Customer Name",
      width: 150,
      align: "left",
    },
    ...periods.map((period) => ({
      field: period,
      headerName: period,
      width: 100,
      align: "center",
    })),
  ];

  const rows = reportResults.reduce((acc, report) => {
    report.customerCounts.forEach((customer) => {
      const existingRow = acc.find(
        (row) => row.customerName === customer.customerName
      );
      if (existingRow) {
        existingRow[report.period] = customer.orderCount;
      } else {
        const newRow = {
          id: `${customer.customerName}-${report.period}`,
          customerID: customer.customerID, // Include customerID field
          customerName: customer.customerName,
        };
        newRow[report.period] = customer.orderCount;
        acc.push(newRow);
      }
    });
    return acc;
  }, []);

  return (
    <Box sx={{ height: "80%", width: "100%", bgcolor: "#ffffff" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        // checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
