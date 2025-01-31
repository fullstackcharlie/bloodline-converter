import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface BloodTestResult {
  markerName: string;
  unit: string;
  measuredValue: string;
  referenceValue: string;
}

export const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  console.log('Loading PDF document');
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
  
  console.log('Extracted full text from PDF');
  return fullText;
}

export const extractMarkers = (text: string): BloodTestResult[] => {
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
}