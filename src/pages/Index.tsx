import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsTable, { BloodTestResult } from '../components/ResultsTable';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const Index = () => {
  const [results, setResults] = useState<BloodTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const extractMarkers = (text: string): BloodTestResult[] => {
    console.log('Extracting markers from text:', text);
    
    // Split text into lines
    const lines = text.split('\n');
    const markers: BloodTestResult[] = [];
    
    // Regular expressions for identifying potential blood test results
    const numberPattern = /[-+]?\d*\.?\d+/;
    const unitPatterns = [
      /g\/L/i, /L\/L/i, /10\^[0-9]+\/L/i, /fL/i, /pg/i, 
      /mmol\/L/i, /umol\/L/i, /U\/L/i, /ml\/min/i
    ];
    
    // Pattern for reference ranges
    const rangePattern = /[<>]?\s*\d+\.?\d*(?:\s*[-–]\s*\d+\.?\d*)?/;

    lines.forEach((line) => {
      console.log('Processing line:', line);
      
      // Check if line contains both a number and a unit
      const hasNumber = numberPattern.test(line);
      const hasUnit = unitPatterns.some(pattern => pattern.test(line));
      
      if (hasNumber && hasUnit) {
        // Split line into parts
        const parts = line.split(/\s+/);
        
        // Find the measured value (first number in the line)
        const measuredValue = parts.find(part => numberPattern.test(part)) || '';
        
        // Find the unit
        const unit = parts.find(part => unitPatterns.some(pattern => pattern.test(part))) || '';
        
        // Find reference range (typically at the end of the line)
        const referenceValue = parts
          .join(' ')
          .match(rangePattern)?.[0] || '';
        
        // The marker name is typically the text before the value and unit
        const valueIndex = parts.findIndex(part => numberPattern.test(part));
        const markerName = parts.slice(0, valueIndex).join(' ').trim();
        
        if (markerName && unit && measuredValue) {
          console.log('Found marker:', { markerName, unit, measuredValue, referenceValue });
          markers.push({
            markerName,
            unit,
            measuredValue,
            referenceValue: referenceValue || 'Not specified'
          });
        }
      }
    });
    
    return markers;
  };

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    try {
      console.log('Processing file:', file.name);
      
      // Load the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      
      console.log('Extracted full text:', fullText);
      
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