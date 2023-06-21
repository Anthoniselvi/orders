import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function ReportsTable({ reportResults }) {
  const periods = reportResults.map((report) => report.period);
  const columns = [
    { field: "customerName", headerName: "Customer Name", width: 200 },
    ...periods.map((period) => ({
      field: period,
      headerName: period,
      width: 150,
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
          customerName: customer.customerName,
        };
        newRow[report.period] = customer.orderCount;
        acc.push(newRow);
      }
    });
    return acc;
  }, []);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
}
