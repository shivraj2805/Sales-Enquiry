import XLSX from 'xlsx';
import fs from 'fs';
import User from '../models/User.js';
import Enquiry from '../models/Enquiry.js';
import { ApiError } from '../middlewares/errorHandler.js';
import { getFieldValue } from '../utils/columnMapper.js';

// Helper function to parse date from Excel
const parseExcelDate = (excelDate) => {
  if (!excelDate) return null;
  
  if (excelDate instanceof Date) return excelDate;
  
  if (typeof excelDate === 'number') {
    const date = XLSX.SSF.parse_date_code(excelDate);
    return new Date(date.y, date.m - 1, date.d);
  }
  
  const parsedDate = new Date(excelDate);
  return isNaN(parsedDate.getTime()) ? null : parsedDate;
};

// Helper function to clean and normalize strings
const cleanString = (str) => {
  if (!str) return '';
  return String(str).trim();
};

// Helper function to standardize activity status
const standardizeActivity = (activity) => {
  const cleaned = cleanString(activity).toLowerCase();
  if (cleaned.includes('quote')) return 'Quoted';
  if (cleaned.includes('regret')) return 'Regretted';
  if (cleaned.includes('progress') || cleaned.includes('pending')) return 'In Progress';
  if (cleaned.includes('hold')) return 'On Hold';
  return 'In Progress';
};

// Helper function to standardize status
const standardizeStatus = (status, activity) => {
  if (activity === 'Quoted' || activity === 'Regretted') return 'Closed';
  const cleaned = cleanString(status).toLowerCase();
  if (cleaned === 'closed' || cleaned === 'close') return 'Closed';
  return 'Open';
};

// Helper function to standardize market type
const standardizeMarketType = (market) => {
  const cleaned = cleanString(market).toLowerCase();
  if (cleaned.includes('export')) return 'Export';
  return 'Domestic';
};

// Helper function to standardize product type
const standardizeProductType = (product) => {
  const cleaned = cleanString(product).toUpperCase();
  if (cleaned === 'SP' || cleaned.includes('STANDARD')) return 'SP';
  if (cleaned === 'NSP' || cleaned.includes('NON') || cleaned.includes('NON-STANDARD')) return 'NSP';
  if (cleaned.includes('SP+NSP') || cleaned.includes('BOTH')) return 'SP+NSP';
  return 'SP'; // Default
};

// Helper function to standardize department status
const standardizeDepartmentStatus = (status) => {
  if (!status) return 'Pending';
  const cleaned = cleanString(status).toLowerCase();
  if (cleaned === 'completed' || cleaned === 'done' || cleaned === 'yes') return 'Completed';
  if (cleaned === 'pending' || cleaned === 'waiting' || cleaned === 'no') return 'Pending';
  if (cleaned.includes('progress') || cleaned === 'wip') return 'In Progress';
  if (cleaned.includes('not required') || cleaned === 'n/a' || cleaned === 'na') return 'Not Required';
  return 'Pending';
};

// Helper function to standardize manufacturing type
const standardizeManufacturingType = (type) => {
  if (!type) return null;
  const cleaned = cleanString(type).toLowerCase();
  if (cleaned.includes('inhouse') || cleaned === 'in-house') return 'Inhouse';
  if (cleaned.includes('brought') || cleaned === 'broughtout') return 'Broughtout';
  if (cleaned.includes('both')) return 'Both';
  return null;
};

// Helper function to get or create user
const getOrCreateUser = async (name, role) => {
  if (!name || cleanString(name) === '') return null;
  
  const cleanName = cleanString(name);
  const email = `${cleanName.toLowerCase().replace(/\s+/g, '.')}@example.com`;
  
  let user = await User.findOne({ name: cleanName });
  
  if (!user) {
    user = await User.create({
      name: cleanName,
      email,
      password: 'password123',
      role: role || 'sales',
      department: role === 'r&d' ? 'Research & Development' : 'Sales',
    });
  }
  
  return user;
};

// @desc    Bulk import enquiries from uploaded Excel file
// @route   POST /api/enquiries/bulk-import
// @access  Private (Admin, Sales)
export const bulkImportEnquiries = async (req, res, next) => {
  let filePath = null;
  
  try {
    if (!req.file) {
      throw new ApiError(400, 'Please upload an Excel file');
    }

    filePath = req.file.path;
    
    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    if (!data || data.length === 0) {
      throw new ApiError(400, 'Excel file is empty or has no data');
    }

    const results = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: [],
      columnNames: Object.keys(data[0] || {}), // Log available columns
    };

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Use flexible column mapping to extract data
        const enquiryNumber = cleanString(getFieldValue(row, 'enquiryNumber'));
        const poNumber = cleanString(getFieldValue(row, 'poNumber'));
        
        // Customer information
        const customerName = cleanString(getFieldValue(row, 'customerName')) || 'N/A';
        const contactInfo = cleanString(getFieldValue(row, 'contactInfo'));
        
        // Date fields
        const dateReceived = parseExcelDate(getFieldValue(row, 'dateReceived'));
        const dateSubmitted = parseExcelDate(getFieldValue(row, 'dateSubmitted'));
        const enquiryDate = dateReceived || parseExcelDate(getFieldValue(row, 'enquiryDate'));
        
        // Market and Product Type
        const marketType = standardizeMarketType(getFieldValue(row, 'marketType'));
        const productType = standardizeProductType(getFieldValue(row, 'productType'));
        
        // Enquiry details
        const enquiryDetails = cleanString(getFieldValue(row, 'enquiryDetails'));
        const quantity = getFieldValue(row, 'quantity');
        const requirementSpec = cleanString(getFieldValue(row, 'requirementSpec'));
        const supplyScope = cleanString(getFieldValue(row, 'supplyScope'));
        const estimatedValue = getFieldValue(row, 'estimatedValue');
        
        // Department status fields
        const drawingStatus = standardizeDepartmentStatus(getFieldValue(row, 'drawingStatus'));
        const costingStatus = standardizeDepartmentStatus(getFieldValue(row, 'costingStatus'));
        const rndStatus = standardizeDepartmentStatus(getFieldValue(row, 'rndStatus'));
        const salesStatus = standardizeDepartmentStatus(getFieldValue(row, 'salesStatus'));
        
        // Manufacturing type
        const manufacturingType = standardizeManufacturingType(getFieldValue(row, 'manufacturingType'));
        
        // Activity and status
        const activity = standardizeActivity(getFieldValue(row, 'activity'));
        const status = standardizeStatus(getFieldValue(row, 'status'), activity);
        
        // Dates
        const quoteDate = parseExcelDate(getFieldValue(row, 'quoteDate'));
        const closureDate = parseExcelDate(getFieldValue(row, 'closureDate'));
        
        // Days for fulfillment
        const daysRequiredForFulfillment = getFieldValue(row, 'daysRequired');
        
        // Remarks
        const remarks = cleanString(getFieldValue(row, 'remarks'));
        const delayRemarks = cleanString(getFieldValue(row, 'delayRemarks'));
        
        // Sales representative
        const salesRepName = cleanString(getFieldValue(row, 'salesRep')) || 'Default Sales Rep';
        const salesRep = await getOrCreateUser(salesRepName, 'sales');
        
        // R&D handler
        const rndHandlerName = cleanString(getFieldValue(row, 'rndHandler'));
        const rndHandler = rndHandlerName ? await getOrCreateUser(rndHandlerName, 'r&d') : null;
        
        // Date fields - using EXACT column names
        const dateReceived = parseExcelDate(row['DATE RECEIVED']);
        const dateSubmitted = parseExcelDate(row['DATE SUBMITTED']);
        
        // Use DATE RECEIVED as primary enquiry date, with fallback
        const enquiryDate = dateReceived || parseExcelDate(
          row['Date Received'] ||
          row['Enquiry Date'] || 
          row['Date'] || 
          row['ENQUIRY DATE'] ||
          row['enquiry date']
        );
        
        // Customer name (might not exist in Excel, so we use fallback)
        const customerName = cleanString(
          row['Customer Name'] || 
          row['CUSTOMER'] || 
          row['Customer'] || 
          row['customer name'] ||
          row['CUSTOMER NAME']
        );
        
        // Market type - EXACT column name first, then fallbacks
        const marketType = standardizeMarketType(
          row['EXPORT / DOMESTIC'] || 
          row['Market'] || 
          row['Market Type'] || 
          row['MARKET TYPE'] || 
          row['market type'] || 
          'Domestic'
        );
        
        // Product type - EXACT column name first (with newline), then fallbacks
        const productType = standardizeProductType(
          row['STANDARD / NON STANDARD\nPRODUCT (SP / NSP)'] ||
          row['STANDARD / NON STANDARD PRODUCT (SP / NSP)'] ||
          row['Product Type'] || 
          row['Product'] || 
          row['PRODUCT TYPE'] || 
          row['product type'] ||
          'SP'
        );
        
        const supplyScope = cleanString(
          row['Supply Scope'] || 
          row['Scope'] || 
          row['SUPPLY SCOPE'] || 
          row['supply scope']
        );
        
        const quantity = row['Quantity'] || row['QUANTITY'] || row['quantity'];
        const estimatedValue = row['Estimated Value'] || row['ESTIMATED VALUE'] || row['estimated value'];
        
        // Department status fields - EXACT column names first
        const drawingStatus = standardizeDepartmentStatus(
          row['DRAWING'] || 
          row['Drawing Status'] || 
          row['Drawing']
        );
        
        const costingStatus = standardizeDepartmentStatus(
          row['COSTING'] || 
          row['Costing Status'] || 
          row['Costing']
        );
        
        const rndStatus = standardizeDepartmentStatus(
          row['R&D'] || 
          row['RND Status'] || 
          row['R&D Status']
        );
        
        const salesStatus = standardizeDepartmentStatus(
          row['SALES'] || 
          row['Sales Status'] || 
          row['Sales']
        );
        
        // Manufacturing type - EXACT column name first
        const manufacturingType = standardizeManufacturingType(
          row['INHOUSE / BROUGHTOUT'] || 
          row['INHOUSE / BROUGHT OUT'] ||
          row['Manufacturing Type']
        );
        
        // Activity - EXACT column name first
        const activity = standardizeActivity(
          row['ACTIVITY'] || 
          row['Activity'] || 
          row['Status'] || 
          row['activity'] || 
          'In Progress'
        );
        
        // Status - EXACT column name first
        const status = standardizeStatus(
          row['OPEN / CLOSED'] ||
          row['Enquiry Status'] || 
          row['STATUS'] || 
          row['enquiry status'] || 
          '',
          activity
        );
        
        const quoteDate = parseExcelDate(
          row['Quote Date'] || 
          row['QUOTE DATE'] || 
          row['quote date']
        );
        
        const closureDate = parseExcelDate(
          row['Closure Date'] || 
          row['CLOSURE DATE'] || 
          row['closure date']
        );
        
        // Days for fulfillment - EXACT column name with typo first
        const daysRequiredForFulfillment = row['Days requiered for fullfillment'] || 
          row['Days Required'] || 
          row['Fulfillment Days'];
        
        // Remarks - EXACT column name first
        const remarks = cleanString(
          row['REMARK'] ||
          row['Remarks'] || 
          row['REMARKS'] || 
          row['remarks']
        );
        
        const delayRemarks = cleanString(
          row['Delay Remarks'] || 
          row['DELAY REMARKS'] || 
          row['delay remarks']
        );
        
        // Get or create sales rep
        const salesRepName = cleanString(
          row['Sales Representative'] || 
          row['Sales Rep'] || 
          row['SALES REP'] || 
          row['SALES'] ||
          row['sales rep']
        );
        const salesRep = await getOrCreateUser(salesRepName, 'sales');
        
        // Get or create R&D handler
        const rndHandlerName = cleanString(
          row['R&D Handler'] || 
          row['RND Handler'] || 
          row['R&D HANDLER'] || 
          row['rnd handler']
        );
        const rndHandler = await getOrCreateUser(rndHandlerName, 'r&d');
        
        // Use Enquiry Number or Row Number as fallback for customer name
        const fallbackCustomerName = enquiryNumber || 
          poNumber || 
          `Enquiry-${i + 1}`;
        
        const finalCustomerName = customerName || fallbackCustomerName;
        const finalEnquiryDate = enquiryDate || new Date(); // Use current date as fallback
        
        // Skip row only if both are completely empty after all attempts
        if (!finalCustomerName && !finalEnquiryDate) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            error: 'Row appears to be completely empty',
            data: { row: Object.keys(row).length + ' columns found' }
          });
          continue;
        }
        
        // Create enquiry
        const enquiryData = {
          customerName: finalCustomerName,
          enquiryDate: finalEnquiryDate,
          marketType,
          productType,
          supplyScope,
          activity,
          status,
          quoteDate,
          closureDate,
          remarks,
          delayRemarks,
          createdBy: req.user.id,
        };
        
        // Add enquiry number if present in Excel
        if (enquiryNumber) enquiryData.enquiryNumber = enquiryNumber;
        
        // Add optional fields
        if (poNumber) enquiryData.poNumber = poNumber;
        if (dateReceived) enquiryData.dateReceived = dateReceived;
        if (dateSubmitted) enquiryData.dateSubmitted = dateSubmitted;
        if (drawingStatus) enquiryData.drawingStatus = drawingStatus;
        if (costingStatus) enquiryData.costingStatus = costingStatus;
        if (rndStatus) enquiryData.rndStatus = rndStatus;
        if (salesStatus) enquiryData.salesStatus = salesStatus;
        if (manufacturingType) enquiryData.manufacturingType = manufacturingType;
        if (daysRequiredForFulfillment) enquiryData.daysRequiredForFulfillment = parseInt(daysRequiredForFulfillment);
        if (quantity) enquiryData.quantity = parseInt(quantity);
        if (estimatedValue) enquiryData.estimatedValue = parseFloat(estimatedValue);
        
        if (salesRep) {
          enquiryData.salesRepresentative = salesRep._id;
          enquiryData.salesRepName = salesRep.name;
        } else {
          // Use current user as fallback
          enquiryData.salesRepresentative = req.user.id;
          enquiryData.salesRepName = req.user.name;
        }
        
        if (rndHandler) {
          enquiryData.rndHandler = rndHandler._id;
          enquiryData.rndHandlerName = rndHandler.name;
        }
        
        await Enquiry.create(enquiryData);
        results.successful++;
        
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          error: error.message,
        });
      }
    }

    // Delete the uploaded file after processing
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({
      success: true,
      message: 'Import completed',
      data: results,
    });
    
  } catch (error) {
    // Delete the uploaded file if there's an error
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    next(error);
  }
};
