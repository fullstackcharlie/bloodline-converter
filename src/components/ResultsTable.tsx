import React from 'react';

export interface BloodTestResult {
  markerName: string;
  unit: string;
  measuredValue: string;
  referenceValue: string;
}

interface ResultsTableProps {
  results: BloodTestResult[];
}

const ResultsTable = ({ results }: ResultsTableProps) => {
  if (!results.length) return null;

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-medical-primary text-white">
          <tr>
            <th className="px-4 py-3 text-left">Marker Name</th>
            <th className="px-4 py-3 text-left">Unit</th>
            <th className="px-4 py-3 text-left">Measured Value</th>
            <th className="px-4 py-3 text-left">Reference Value/Range</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr 
              key={index}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3">{result.markerName}</td>
              <td className="px-4 py-3">{result.unit}</td>
              <td className="px-4 py-3">{result.measuredValue}</td>
              <td className="px-4 py-3">{result.referenceValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;