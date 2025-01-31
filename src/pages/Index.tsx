import React from 'react';
import PDFProcessor from '../components/PDFProcessor';

const Index = () => {
  return (
    <div className="min-h-screen bg-medical-light">
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-medical-primary mb-2">
          Blood Test Results Converter
        </h1>
        <p className="text-gray-600 mb-8">
          Convert your blood test results from PDF to CSV format. Simply upload your PDF file below.
        </p>
        
        <PDFProcessor />
      </div>
    </div>
  );
};

export default Index;