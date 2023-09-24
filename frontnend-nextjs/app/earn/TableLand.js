import React, { useEffect, useState } from 'react';
import ValidationModal from './ValidationModal'; // Import your modal component

const TableComponent = ({ tableName }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);

  useEffect(() => {
    // Fetch table data based on the provided table name
    const apiUrl = `/api/tableland?tableName=${encodeURIComponent(tableName)}`;

    fetch(apiUrl) // Make a request to the new API route with the table name as a query parameter
      .then((response) => response.json())
      .then((data) => {
        // Check if 'data' contains a 'data' property (indicates that it's the expected format)
        if (data && Array.isArray(data.data)) {
          setTableData(data.data); // Extract 'data' property from the response
        } else {
          console.error('Unexpected data format:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [tableName]);

  // Handle row click event
  const handleRowClick = (row) => {
    setSelectedRowData(row);
  };

  // Render the table with the fetched data
  return (
    <div className="overflow-x-auto overflow-y-auto">
      <h3 className="text-sm mb-4">{tableName} Table</h3>
      <table className="table-auto min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {tableData.length > 0 &&
              Object.keys(tableData[0]).map((columnName) => (
                <th
                  key={columnName}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {columnName}
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, index) => (
            <tr
              key={index}
              onClick={() => handleRowClick(row)} // Handle row click
              className="cursor-pointer hover:bg-gray-100"
            >
              {Object.values(row).map((value, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render RowDetailsModal when selectedRowData is not null */}
      {selectedRowData && (
        <ValidationModal
          rowData={selectedRowData}
          onClose={() => setSelectedRowData(null)} // Close modal when needed
        />
      )}
    </div>
  );
};

export default TableComponent;
