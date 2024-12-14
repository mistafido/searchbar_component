import './App.css';
import React, { useState, useEffect } from 'react'
import * as Papa from "papaparse";

function App() {
  const [excelData, setExcelData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your published CSV URL
    const sheetUrl =
      "https://docs.google.com/spreadsheets/d/1FOU768wONkJgZGr_EFPu5u1egyt0sjCwxKrPD205ZG8/pub?gid=1493726472&single=true&output=csv";
 
    fetch(sheetUrl)
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            setExcelData(results.data);
            setLoading(false)
          },
          error: (error) => {
            console.error("Error parsing CSV: ", error);
            setError("Failed to load data.");
            setLoading(false)
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Failed to fetch data.");
        setLoading(false)
      });
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.trim();
    setError("");
    setSearchResults(null);

    // Ensure the search term is only a number (student ID)
    if (!searchTerm || isNaN(searchTerm)) {
      setError("Please enter a valid student ID.");
      return;
    }

    const result = excelData.find(row => row.Student_ID === searchTerm);
    
    if (result) {
      setSearchResults([result]);
    } else {
      setError("No results found for the entered student ID.");
    }
  };

  return (
    <div className="search-container">
      <h1>Check your Examinations Center</h1>
      <input
        type="text"
        placeholder="Enter your student ID"
        className="search-input"
        onChange={handleSearch}
        disabled={loading}
      />
      {error && <p className="error-message">{error}</p>}
      {searchResults && searchResults.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Student_ID</th>
              <th>Student_Name</th>
              <th>Examinations_Center</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result, index) => (
              <tr key={index}>
                <td>{result.Student_ID}</td>
                <td>{result.Student_Name}</td>
                <td>{result.Examinations_Center}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
    
export default App;
