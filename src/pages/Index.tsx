import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsTable, { BloodTestResult } from '../components/ResultsTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [results, setResults] = useState<BloodTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    // TODO: Implement actual PDF parsing logic
    // For now, we'll simulate processing with sample data
    setTimeout(() => {
      const sampleData: BloodTestResult[] = [
        // Red Blood Cells
        {
          markerName: "Haemoglobin",
          unit: "g/L",
          measuredValue: "146",
          referenceValue: "130-180"
        },
        {
          markerName: "Haematocrit",
          unit: "L/L",
          measuredValue: "0.435",
          referenceValue: "0.4-0.52"
        },
        {
          markerName: "Red Cell Count",
          unit: "10^12/L",
          measuredValue: "4.78",
          referenceValue: "4.4-6.5"
        },
        {
          markerName: "MCV",
          unit: "fL",
          measuredValue: "91.0",
          referenceValue: "80-100"
        },
        {
          markerName: "MCH",
          unit: "pg",
          measuredValue: "30.6",
          referenceValue: "27-32"
        },
        // White Blood Cells
        {
          markerName: "White Cell Count",
          unit: "10^9/L",
          measuredValue: "4.5",
          referenceValue: "3-11"
        },
        {
          markerName: "Neutrophils",
          unit: "10^9/L",
          measuredValue: "2.6",
          referenceValue: "2-7.5"
        },
        {
          markerName: "Lymphocytes",
          unit: "10^9/L",
          measuredValue: "1.80",
          referenceValue: "1.5-4.5"
        },
        // Clotting Status
        {
          markerName: "Platelet Count",
          unit: "10^9/L",
          measuredValue: "194",
          referenceValue: "150-450"
        },
        {
          markerName: "MPV",
          unit: "fL",
          measuredValue: "11.2",
          referenceValue: "7-13"
        },
        // Kidney Health
        {
          markerName: "Urea",
          unit: "mmol/L",
          measuredValue: "5.7",
          referenceValue: "2.5-7.8"
        },
        {
          markerName: "Creatinine",
          unit: "umol/L",
          measuredValue: "113",
          referenceValue: "60-120"
        },
        {
          markerName: "eGFR",
          unit: "ml/min/1.73m2",
          measuredValue: "70",
          referenceValue: "≥ 60"
        },
        // Liver Health
        {
          markerName: "Bilirubin",
          unit: "umol/L",
          measuredValue: "10",
          referenceValue: "< 22"
        },
        {
          markerName: "ALP",
          unit: "U/L",
          measuredValue: "74",
          referenceValue: "30-130"
        },
        {
          markerName: "ALT",
          unit: "U/L",
          measuredValue: "23",
          referenceValue: "< 45"
        }
      ];
      setResults(sampleData);
      setLoading(false);
      toast.success('File processed successfully');
    }, 1500);
  };

  const handleDownload = () => {
    if (!results.length) return;

    const csvContent = [
      ['Marker Name', 'Unit', 'Measured Value', 'Reference Value'],
      ...results.map(result => [
        result.markerName,
        result.unit,
        result.measuredValue,
        result.referenceValue
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blood_test_results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-medical-light">
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-medical-primary mb-2">
          Blood Test Results Converter
        </h1>
        <p className="text-gray-600 mb-8">
          Convert your blood test results from PDF to CSV format. Simply upload your PDF file below.
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
          <FileUpload onFileSelect={handleFileSelect} />
          
          {loading && (
            <div className="text-center mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing your file...</p>
            </div>
          )}

          <ResultsTable results={results} />

          {results.length > 0 && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleDownload}
                className="bg-medical-primary hover:bg-medical-accent text-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;