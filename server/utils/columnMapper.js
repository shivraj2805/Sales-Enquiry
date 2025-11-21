// Helper function to find value in row by checking multiple possible column names
export const findValueInRow = (row, ...possibleNames) => {
  // Try exact match first
  for (const name of possibleNames) {
    const value = row[name];
    if (value !== undefined && value !== null && value !== '' && value !== '-') {
      return value;
    }
  }
  
  // Try case-insensitive search
  const rowKeys = Object.keys(row);
  for (const name of possibleNames) {
    const lowerName = name.toLowerCase();
    const matchingKey = rowKeys.find(key => key.toLowerCase() === lowerName);
    if (matchingKey) {
      const value = row[matchingKey];
      if (value !== undefined && value !== null && value !== '' && value !== '-') {
        return value;
      }
    }
  }
  
  // Try fuzzy match (remove spaces, dots, special chars)
  const normalize = (str) => str.toLowerCase().replace(/[\s.\-_/]/g, '');
  for (const name of possibleNames) {
    const normalizedName = normalize(name);
    const matchingKey = rowKeys.find(key => normalize(key) === normalizedName);
    if (matchingKey) {
      const value = row[matchingKey];
      if (value !== undefined && value !== null && value !== '' && value !== '-') {
        console.log(`Fuzzy matched "${matchingKey}" to "${name}"`);
        return value;
      }
    }
  }
  
  return null;
};

// Column mapping configuration based on the actual Excel structure
export const COLUMN_MAPPINGS = {
  // Serial Number / ID
  srNo: ['SR. No.', 'SR NO', 'S.No', 'Serial No', 'Sr No', 'SR.No.', 'Sr.No.', 'S. No.'],
  
  // Enquiry Number (Primary Key)
  enquiryNumber: ['Enq No.', 'ENQ NO', 'Enquiry No', 'Enquiry Number', 'EnqNo', 'Enq.No.', 'Enq. No.', 'ENQ. NO.', 'Enquiry No.'],
  
  // Market Segment
  marketType: ['EXPORT / DOMESTIC', 'Market', 'Market Type', 'MARKET TYPE', 'Export/Domestic', 'Market Segment', 'EXPORT/DOMESTIC', 'Export / Domestic'],
  
  // PO Number (mostly empty in dataset)
  poNumber: ['PO No.', 'PO NO', 'PO Number', 'Purchase Order', 'PONo', 'PO. No.', 'P.O. No.'],
  
  // Dates
  dateReceived: ['DATE RECEIVED', 'Date Received', 'Received Date', 'DateReceived', 'DATE. RECEIVED', 'Date. Received'],
  dateSubmitted: ['DATE SUBMITTED', 'Date Submitted', 'Submitted Date', 'DateSubmitted', 'Quotation Date', 'DATE. SUBMITTED', 'Date. Submitted'],
  
  // Requirements (Boolean Y/N fields)
  drawingRequired: ['DRAWING', 'Drawing', 'Drawing Required', 'DrawingRequired', 'DRAWING.', 'Drawing.'],
  costingCompleted: ['COSTING', 'Costing', 'Costing Completed', 'CostingCompleted', 'COSTING.', 'Costing.'],
  
  // Team Assignment
  rndHandler: ['R&D', 'RND', 'R&D Handler', 'RND Handler', 'R&D Person', 'Research', 'R & D', 'R&D.', 'R & D.'],
  salesRep: ['SALES', 'Sales', 'Sales Representative', 'Sales Rep', 'SALES REP', 'Representative', 'SALES.', 'Sales.'],
  
  // Status Fields
  status: ['OPEN / CLOSED', 'STATUS', 'Enquiry Status', 'Status', 'Open/Closed', 'OPEN/CLOSED', 'Open / Closed', 'OPEN. / CLOSED.'],
  activity: ['ACTIVITY', 'Activity', 'Current Activity', 'ActivityStatus', 'ACTIVITY.', 'Activity.'],
  
  // Scope and Product
  supplyScope: ['SCOPE OF SUPPLY', 'Supply Scope', 'Scope', 'SUPPLY SCOPE', 'ScopeOfSupply', 'Scope Of Supply', 'SCOPE. OF SUPPLY'],
  productType: ['PRODUCT TYPE', 'Product Type', 'ProductType', 'Product', 'PRODUCT. TYPE', 'Product. Type'],
  
  // Performance
  daysRequired: ['DAYS TO COMPLETE', 'Days To Complete', 'DAYS TO COMPLETE ENQUIRY', 'Days Required', 'Fulfillment Days', 'DaysToComplete', 'Days to Complete Enquiry', 'DAYS. TO COMPLETE', 'Days requiered for fullfillment'],
  
  // Remarks
  remarks: ['REMARK', 'Remarks', 'REMARKS', 'Comments', 'Notes', 'Closure Reason', 'REMARK.', 'Remarks.'],
};

// Standardization functions
export const standardizeBoolean = (value) => {
  if (!value) return false;
  const str = String(value).toUpperCase().trim();
  return str === 'Y' || str === 'YES' || str === 'TRUE' || str === '1';
};

export const standardizeMarketSegment = (value) => {
  if (!value) return 'Domestic';
  const str = String(value).toUpperCase().trim();
  if (str.includes('EXPORT')) return 'Export';
  if (str.includes('DOMESTIC')) return 'Domestic';
  return 'Domestic';
};

export const standardizeActivity = (value) => {
  if (!value) return 'In Progress';
  const str = String(value).toUpperCase().trim();
  if (str === 'QUOTED' || str.includes('QUOTE')) return 'Quoted';
  if (str === 'REGRETED' || str === 'REGRETTED' || str.includes('REGRET')) return 'Regretted';
  if (str === 'IN-HOUSE' || str === 'INHOUSE') return 'In Progress';
  if (str === 'ON HOLD' || str === 'HOLD') return 'On Hold';
  if (str === '-' || str === '') return 'In Progress';
  return 'In Progress';
};

export const standardizeStatus = (value, activity) => {
  if (!value) return activity === 'Quoted' || activity === 'Regretted' ? 'Closed' : 'Open';
  const str = String(value).toUpperCase().trim();
  if (str === 'CLOSED' || str === 'CLOSE') return 'Closed';
  if (str === 'OPEN') return 'Open';
  return activity === 'Quoted' || activity === 'Regretted' ? 'Closed' : 'Open';
};

export const standardizeSupplyScope = (value) => {
  if (!value || value === '-') return null;
  const str = String(value).toUpperCase().trim();
  if (str === 'IN-HOUSE' || str === 'INHOUSE') return 'Inhouse';
  if (str === 'BO' || str === 'BROUGHTOUT' || str === 'BROUGHT OUT') return 'Broughtout';
  if (str.includes('IN-HOUSE') && str.includes('BO')) return 'Both';
  if (str.includes('&')) return 'Both';
  return null;
};

export const standardizeProductType = (value) => {
  if (!value || value === '-') return 'SP';
  const str = String(value).toUpperCase().trim();
  if (str === 'SP') return 'SP';
  if (str === 'NSP') return 'NSP';
  if (str.includes('SP') && str.includes('NSP')) return 'SP+NSP';
  if (str.includes('&')) return 'SP+NSP';
  return 'SP';
};

// Get value using predefined column mapping
export const getFieldValue = (row, fieldName) => {
  const possibleColumns = COLUMN_MAPPINGS[fieldName] || [];
  return findValueInRow(row, ...possibleColumns);
};
