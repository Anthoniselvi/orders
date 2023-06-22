let dataArray = [];

export const setDataArray = (data) => {
  dataArray = data;
};

export const getDataArray = () => {
  return dataArray;
};

export const saveDataArrayToFile = () => {
  const data = JSON.stringify(dataArray, null, 2);
  const filename = "data.json";

  const blob = new Blob([data], { type: "application/json" });
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // For IE browser
    window.navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // For other browsers
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
};
