# Import Error Fix - "enquiryNumber is not defined"

## Problem

When importing enquiries from Excel through the UI, all 430 rows were failing with the error:
```
enquiryNumber is not defined
```

## Root Cause

The `enquiryNumber` variable was being **extracted from the Excel file** but:
1. ❌ It was never being **defined** in the `importController.js`
2. ❌ It was being **referenced** in the fallback logic but not declared
3. ❌ It was **not being added** to the `enquiryData` object before saving

## Solution

### Fixed Files

1. **`server/controllers/importController.js`** (API endpoint - used by UI)
2. **`server/scripts/importFromExcel.js`** (Standalone script)

### Changes Made

#### 1. Added Variable Declaration

```javascript
// OLD - Variable was missing
const poNumber = cleanString(row['PO No.'] || ...);

// NEW - Added enquiryNumber extraction
const srNo = row['SR. No.'];
const enquiryNumber = cleanString(row['Enq No.']);
const poNumber = cleanString(row['PO No.']);
```

#### 2. Added Field to enquiryData Object

```javascript
const enquiryData = {
  customerName: finalCustomerName,
  enquiryDate: finalEnquiryDate,
  marketType,
  productType,
  // ... other fields
};

// NEW - Add enquiry number if present in Excel
if (enquiryNumber) enquiryData.enquiryNumber = enquiryNumber;

// Then add other optional fields...
if (poNumber) enquiryData.poNumber = poNumber;
```

#### 3. Updated Column Name Mapping Priority

Ensured EXACT Excel column names are tried first, then fallbacks:

```javascript
// Date fields - EXACT column names first
const dateReceived = parseExcelDate(row['DATE RECEIVED']);
const dateSubmitted = parseExcelDate(row['DATE SUBMITTED']);

// Use DATE RECEIVED as primary enquiry date
const enquiryDate = dateReceived || parseExcelDate(
  row['Date Received'] ||
  row['Enquiry Date'] || 
  // ... other fallbacks
);
```

## How Import Works Now

### Column Extraction Flow

```
Excel File
    ↓
1. Extract SR. No. (reference only)
2. Extract Enq No. → enquiryNumber
3. Extract PO No. → poNumber
4. Extract DATE RECEIVED → dateReceived & enquiryDate
5. Extract DATE SUBMITTED → dateSubmitted
6. Extract EXPORT / DOMESTIC → marketType
7. Extract DRAWING, COSTING, R&D, SALES → department statuses
8. Extract ACTIVITY → activity
9. Extract OPEN / CLOSED → status
10. Extract INHOUSE / BROUGHTOUT → manufacturingType
11. Extract STANDARD / NON STANDARD PRODUCT → productType
12. Extract Days requiered for fullfillment → daysRequiredForFulfillment
13. Extract REMARK → remarks
    ↓
Build enquiryData object
    ↓
Add enquiryNumber if present
    ↓
Add all other optional fields
    ↓
Save to MongoDB
```

### Field Priority

1. **enquiryNumber**: From Excel `Enq No.` column (optional)
   - If present, uses the Excel value
   - If not present, MongoDB will auto-generate (format: ENQ-YYYYMM-0001)

2. **customerName**: 
   - First tries `Customer Name` column
   - Falls back to enquiryNumber → poNumber → `Enquiry-{rowNumber}`

3. **enquiryDate**:
   - Primary: `DATE RECEIVED` column
   - Fallback: Other date columns or current date

## Testing

### Import via UI

1. Go to **Import Enquiries** page
2. Upload your Excel file: `SALES ENQUIRY TRACKER_Sample data_ 2025-26_VIT Project (1).xls`
3. Click **Import**
4. Should now see:
   ```
   ✅ Successfully imported: 430 enquiries
   ❌ Failed: 0
   ```

### Import via Script

```bash
cd server
node scripts/importFromExcel.js
```

## Expected Results

- **All rows should import successfully** (assuming data is valid)
- Each enquiry will have:
  - ✅ Enquiry number (from Excel or auto-generated)
  - ✅ All department statuses mapped correctly
  - ✅ Dates parsed from Excel
  - ✅ Market type, product type standardized
  - ✅ Activity and status properly set

## Notes

1. **Auto-Generation**: If `Enq No.` column is empty, MongoDB will auto-generate enquiry numbers
2. **Duplicates**: If `Enq No.` from Excel duplicates an existing number, import will fail for that row (unique constraint)
3. **Validation**: All enum fields are standardized to match valid values
4. **Required Fields**: Only `DATE RECEIVED` is truly required; other fields have defaults

## Verification

After import, verify:
- [ ] All enquiries appear in the enquiry list
- [ ] Enquiry numbers are properly set (either from Excel or auto-generated)
- [ ] Department statuses are correctly mapped
- [ ] Dates are properly parsed
- [ ] Market type and product type match Excel data
- [ ] Activity and status are correctly set
