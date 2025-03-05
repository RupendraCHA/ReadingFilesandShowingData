import React, { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";

const FileReaderComponent = () => {
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState("");

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    // console.log(file)
    const fileExtension = file.name.split(".").pop().toLowerCase();
    // console.log(fileExtension)
    setFileType(fileExtension);

    reader.onload = (event) => {
      const content = event.target.result;

      if (fileExtension === "txt") {
        setFileContent(content);
      } else if (fileExtension === "json") {
        setFileContent(JSON.parse(content));
      } else if (fileExtension === "csv") {
        Papa.parse(content, {
          header: true,
          complete: (result) => setFileContent(result.data),
        });
      } else if (fileExtension === "xls" || fileExtension === "xlsx") {
        const workbook = XLSX.read(content, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const excelData = XLSX.utils.sheet_to_json(sheet);
        setFileContent(excelData);
      } else {
        setFileContent("Unsupported file type.");
      }
    };

    if (fileExtension === "xls" || fileExtension === "xlsx") {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const removeFile = () => {
    setFileContent(null)
  }

  return (
    <div className="p-6 text-center flex flex-col items-center justify-center h-[100vh]">
      <h2 className="text-2xl font-bold mb-4">Upload a File</h2>
      <div className="flex space-x-4">
          <label htmlFor="file-upload" className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg">
            Upload File
          </label>
          <button className="border-2 border-amber-400 p-2 rounded-2xl bg-amber-700 text-white cursor-pointer font-bold" onClick={removeFile}>Remove File</button>
      </div>
        <input type="file"  
        id="file-upload"
        accept=".xlsx,.xls,.csv,.json,.txt" onChange={handleFileUpload} className="hidden bg-amber-100 border-2 border-blue-300 p-3 font-bold rounded-lg shadow-lg mb-4" />
      
      {/* Display Content */}
      {fileContent && (
        <div className="mt-4 p-4 border rounded overflow-auto w-full text-center">
          <h3 className="text-xl font-semibold mb-2">File Content</h3>

          {fileType === "txt" && <pre>{fileContent}</pre>}

          {fileType === "json" && (
            <pre className="overflow-x-auto">{JSON.stringify(fileContent, null, 2)}</pre>
          )}

          {fileType === "csv" || fileType === "xls" || fileType === "xlsx" ? (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(fileContent[0] || {}).map((key) => (
                    <th key={key} className="border p-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fileContent.map((row, index) => (
                  <tr key={index} className="border">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="border p-2">{String(value)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default FileReaderComponent;
