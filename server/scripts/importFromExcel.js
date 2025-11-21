import mongoose from 'mongoose';
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Enquiry from '../models/Enquiry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales-enquiry';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Helper function to parse date from Excel
const parseExcelDate = (excelDate) => {
  if (!excelDate) return null;
  
  // If it's already a date object
  if (excelDate instanceof Date) return excelDate;
  
  // If it's an Excel serial number
  if (typeof excelDate === 'number') {
    const date = XLSX.SSF.parse_date_code(excelDate);
    return new Date(date.y, date.m - 1, date.d);
  }
  
  // Try to parse as string
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
  return 'In Progress'; // Default
};

// Helper function to standardize status
const standardizeStatus = (status) => {
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
    console.log(`  ✅ Created user: ${cleanName} (${role})`);
  }
  
  return user;
};

// Import enquiries from Excel file
const importFromExcel = async () => {
  try {
    console.log('\n📊 Starting Excel Import Process...\n');
    
    // Read the Excel file
    const filePath = path.join(__dirname, '../data/SALES ENQUIRY TRACKER_Sample data_ 2025-26_VIT Project (1).xls');
    console.log(`📁 Reading file: ${filePath}`);
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`📋 Found ${data.length} rows in Excel file\n`);
    
    // Log column names from first row to help with mapping
    if (data.length > 0) {
      console.log('📝 Excel Column Names:');
      Object.keys(data[0]).forEach((key, index) => {
        console.log(`   ${index + 1}. "${key}"`);
      });
      console.log('\n');
    }
    
    // Clear existing enquiries (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing enquiries...');
    await Enquiry.deleteMany({});
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        // Extract data from row using EXACT column names from Excel
        const srNo = row['SR. No.'];
        const enquiryNumber = cleanString(row['Enq No.']);
        const poNumber = cleanString(row['PO No.']);
        
        // Date fields
        const dateReceived = parseExcelDate(row['DATE RECEIVED']);
        const dateSubmitted = parseExcelDate(row['DATE SUBMITTED']);
        const enquiryDate = dateReceived || parseExcelDate(row['DATE RECEIVED']); // Use DATE RECEIVED as enquiry date
        
        // Customer name might not be in Excel - we'll use a placeholder or derive from other fields
        const customerName = cleanString(row['Customer Name']) || 'N/A';
        
        // Market type
        const marketType = standardizeMarketType(row['EXPORT / DOMESTIC']);
        
        // Product type
        const productType = standardizeProductType(row['STANDARD / NON STANDARD\nPRODUCT (SP / NSP)']);
        
        const supplyScope = cleanString(row['Supply Scope'] || '');
        
        // Department status fields - EXACT column names
        const drawingStatus = standardizeDepartmentStatus(row['DRAWING']);
        const costingStatus = standardizeDepartmentStatus(row['COSTING']);
        const rndStatus = standardizeDepartmentStatus(row['R&D']);
        const salesStatus = standardizeDepartmentStatus(row['SALES']);
        
        // Manufacturing type - EXACT column name
        const manufacturingType = standardizeManufacturingType(row['INHOUSE / BROUGHTOUT']);
        
        // Status fields - EXACT column names
        const activity = standardizeActivity(row['ACTIVITY']);
        const status = standardizeStatus(row['OPEN / CLOSED']);
        
        const quoteDate = parseExcelDate(row['Quote Date']);
        const closureDate = parseExcelDate(row['Closure Date']);
        
        // Days for fulfillment - EXACT column name (note the typo in Excel: "requiered")
        const daysRequiredForFulfillment = row['Days requiered for fullfillment'];
        
        // Remarks - EXACT column name
        const remarks = cleanString(row['REMARK']);
        const delayRemarks = cleanString(row['Delay Remarks']);
        
        // Get or create sales rep (you may need to add Sales Rep column to Excel)
        const salesRepName = cleanString(row['Sales Representative'] || row['SALES REP'] || 'Default Sales Rep');
        const salesRep = await getOrCreateUser(salesRepName, 'sales');
        
        // Get or create R&D handler (you may need to add R&D Handler column to Excel)
        const rndHandlerName = cleanString(row['R&D Handler'] || row['RND Handler']);
        const rndHandler = rndHandlerName ? await getOrCreateUser(rndHandlerName, 'r&d') : null;
        
        // Skip if no enquiry date (DATE RECEIVED is required)
        if (!enquiryDate) {
          console.log(`  ⚠️  Row ${i + 1}: Skipping - Missing DATE RECEIVED`);
          errorCount++;
          continue;
        }
        
        // Create enquiry
        const enquiryData = {
          customerName,
          enquiryDate,
          marketType,
          productType,
          supplyScope,
          activity,
          status,
          quoteDate,
          closureDate,
          remarks,
          delayRemarks,
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
        
        if (salesRep) {
          enquiryData.salesRepresentative = salesRep._id;
          enquiryData.salesRepName = salesRep.name;
          enquiryData.createdBy = salesRep._id;
        }
        
        if (rndHandler) {
          enquiryData.rndHandler = rndHandler._id;
          enquiryData.rndHandlerName = rndHandler.name;
        }
        
        await Enquiry.create(enquiryData);
        
        successCount++;
        if ((i + 1) % 50 === 0) {
          console.log(`  ✅ Processed ${i + 1} rows...`);
        }
        
      } catch (error) {
        errorCount++;
        errors.push({ row: i + 1, error: error.message });
        console.error(`  ❌ Row ${i + 1}: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 IMPORT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully imported: ${successCount} enquiries`);
    console.log(`❌ Failed: ${errorCount} rows`);
    console.log(`📈 Total processed: ${data.length} rows`);
    console.log('='.repeat(60) + '\n');
    
    if (errors.length > 0 && errors.length <= 10) {
      console.log('❌ Error Details:');
      errors.forEach(err => {
        console.log(`   Row ${err.row}: ${err.error}`);
      });
      console.log();
    }
    
    // Show sample imported data
    const sampleEnquiries = await Enquiry.find().limit(5).populate('salesRepresentative rndHandler');
    console.log('📋 Sample Imported Enquiries:');
    sampleEnquiries.forEach((enq, idx) => {
      console.log(`${idx + 1}. ${enq.enquiryNumber} - ${enq.customerName} (${enq.marketType})`);
    });
    console.log();
    
  } catch (error) {
    console.error('❌ Import Error:', error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await importFromExcel();
    console.log('✅ Import completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

main();
