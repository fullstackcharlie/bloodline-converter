import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ResultsTable from './ResultsTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextFromPDF, extractMarkers, type BloodTestResult } from '../utils/pdfProcessor';

const PDFProcessor = () => {
  const [results, setResults] = useState<BloodTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    try {
      console.log('Processing file:', file.name);
      
      // Load and process the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const fullText = await extractTextFromPDF(arrayBuffer);
      
      // Extract markers from the text
      const extractedResults = extractMarkers(fullText);
      
      if (extractedResults.length === 0) {
        toast.error('No blood test results found in the PDF');
      } else {
        setResults(extractedResults);
        toast.success(`Found ${extractedResults.length} test results`);
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast.error('Error processing PDF file');
    } finally {
      setLoading(false);
    }
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
  );
};

export default PDFProcessor;