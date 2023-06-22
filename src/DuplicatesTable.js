import * as React from "react";

export default function DuplicatesTable({
  duplicateCustomers,
  duplicateAddresses,
}) {
  const renderMobileDuplicates = () => {
    return duplicateCustomers.map((duplicate, index) => (
      <div key={index}>
        <h3
          style={{ textAlign: "left", color: "#3480FA", paddingLeft: "20px" }}
        >
          Mobile Number: {duplicate.mobileNumber}
        </h3>

        {duplicate.customers.map((customer, i) => (
          <div key={i} style={{ backgroundColor: "#fff" }}>
            <p style={{ textAlign: "left", fontSize: 14 }}>
              {`${i + 1}. ${customer.customerID} - ${customer.customerName}`}
            </p>
          </div>
        ))}
      </div>
    ));
  };

  const renderAddressDuplicates = () => {
    return duplicateAddresses.map((address, index) => (
      <div key={index}>
        <h3
          style={{ textAlign: "left", color: "#3480FA", paddingLeft: "20px" }}
        >
          {address.address}
        </h3>

        {address.customers.map((customer, i) => (
          <div key={i}>
            <p style={{ textAlign: "left", fontSize: 14 }}>
              {`${i + 1}. ${customer.customerID} - ${customer.customerName}`}
            </p>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <h3>Duplicate Entries</h3>
      <div
        style={{
          alignItems: "left",
          height: "45%",
          overflowY: "scroll",
          border: "1px solid #C9C9C9",
          marginBottom: "25px",
          borderRadius: "10px",
          backgroundColor: "#fff",
          paddingLeft: "20px",
        }}
      >
        {/* <h3>Duplicates by Mobile Number:</h3> */}
        {renderMobileDuplicates()}
      </div>
      <div
        style={{
          alignItems: "left",
          height: "45%",
          overflowY: "scroll",
          border: "1px solid #C9C9C9",
          borderRadius: "10px",
          backgroundColor: "#fff",
          paddingLeft: "20px",
        }}
      >
        {/* <h3>Duplicates by Address:</h3> */}
        {renderAddressDuplicates()}
      </div>
    </div>
  );
}
