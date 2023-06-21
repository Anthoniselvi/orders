import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

export default function DuplicatesTable({
  duplicateCustomers,
  duplicateAddresses,
}) {
  const duplicateMobileColumns = [
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      width: 150,
      cellStyle: { color: "blue" },
    },
    { field: "customerID", headerName: "Customer ID", width: 150 },
    { field: "customerName", headerName: "Customer Name", width: 150 },
  ];

  const duplicateMobileRows = duplicateCustomers.flatMap((duplicate) =>
    duplicate.customers.map((customer, index) => ({
      id: `${duplicate.mobileNumber}-${index}`,
      mobileNumber: duplicate.mobileNumber,
      customerID: customer.customerID,
      customerName: customer.customerName,
    }))
  );

  const duplicateAddressColumns = [
    { field: "address", headerName: "Address", width: 150 },
    { field: "customerID", headerName: "Customer ID", width: 150 },
    { field: "customerName", headerName: "Customer Name", width: 150 },
  ];

  const duplicateAddressRows = duplicateAddresses.flatMap((address, index) =>
    address.customers.map((customer, i) => ({
      id: `${address.address}-${i}`,
      address: address.address,
      customerID: customer.customerID,
      customerName: customer.customerName,
    }))
  );

  return (
    <div style={{ width: "100%" }}>
      <Box sx={{ height: 400, width: "100%" }}>
        <h3>Duplicate by Mobile Numbers</h3>
        <DataGrid
          sx={{ bgcolor: "#ffffff" }}
          rows={duplicateMobileRows}
          columns={duplicateMobileColumns}
          pageSize={5}
          disableSelectionOnClick
        />
        <h3>Duplicate by Addresses</h3>
        <DataGrid
          sx={{ bgcolor: "#ffffff" }}
          rows={duplicateAddressRows}
          columns={duplicateAddressColumns}
          pageSize={5}
          disableSelectionOnClick
        />
      </Box>
    </div>
  );
}
