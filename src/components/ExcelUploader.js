import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

const ExcelUploader = ({ setOrdersData }) => {
  const [dataArray, setDataArray] = useState([]);
  const navigate = useNavigate();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const headers = jsonData[0];
      const ordersData = jsonData.slice(1).map((row) => {
        const order = {};
        row.forEach((value, index) => {
          order[headers[index]] = value;
        });
        return order;
      });

      setDataArray(ordersData);
    };

    fileReader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform any additional actions or logic with the data array
    console.log(dataArray);
    setOrdersData(dataArray);
    navigate("/orders");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ExcelUploader;
