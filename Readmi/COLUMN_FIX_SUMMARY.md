# Column Name Fixes - Summary

## Changes Made

### Updated File: `server/scripts/importFromExcel.js`

Fixed the Excel column name mappings to use **exact** column names from your data table instead of attempting multiple variations.

## Corrected Column Names

The following Excel columns are now mapped correctly:

### Before (Wrong - Multiple Fallbacks)
```javascript
// Was trying multiple variations like:
row['Enq No.'] || row['ENQ NO'] || row['Enquiry No'] || ...
row['EXPORT / DOMESTIC'] || row['Market'] || row['Market Type'] || ...
```

### After (Correct - Exact Names)
```javascript
// Now using exact column names:
row['SR. No.']                                          // Serial number
row['Enq No.']                                          // Enquiry number
row['EXPORT / DOMESTIC']                                // Market type
row['PO No.']                                           // PO number
row['DATE RECEIVED']                                    // Date received
row['DATE SUBMITTED']                                   // Date submitted
row['DRAWING']                                          // Drawing status
row['COSTING']                                          // Costing status
row['R&D']                                              // R&D status
row['SALES']                                            // Sales status
row['OPEN / CLOSED']                                    // Enquiry status
row['ACTIVITY']                                         // Activity status
row['INHOUSE / BROUGHTOUT']                            // Manufacturing type
row['STANDARD / NON STANDARD\nPRODUCT (SP / NSP)']    // Product type (note: contains \n)
row['Days requiered for fullfillment']                 // Days required (note: typo in Excel)
row['REMARK']                                          // Remarks
```

## Key Points

1. **Case Sensitive**: All column names must match exactly, including uppercase/lowercase
2. **Spaces Matter**: Spaces in column names must match exactly
3. **Special Characters**: 
   - The product type column contains a newline character (`\n`)
   - "Days requiered" has a typo in the Excel file (misspelled "required")
4. **DATE RECEIVED**: Now correctly used as the primary enquiry date
5. **No More Fallbacks**: Removed all the `||` fallback attempts since we have exact column names

## Data Flow

```
Excel Column             →  Standardization  →  Database Field
--------------------------------------------------------------------------------
SR. No.                  →  (reference only)  →  Not stored
Enq No.                  →  Clean string      →  enquiryNumber
EXPORT / DOMESTIC        →  Normalize case    →  marketType (Enum)
PO No.                   →  Clean string      →  poNumber
DATE RECEIVED            →  Parse date        →  dateReceived + enquiryDate
DATE SUBMITTED           →  Parse date        →  dateSubmitted
DRAWING                  →  Standardize       →  drawingStatus (Enum)
COSTING                  →  Standardize       →  costingStatus (Enum)
R&D                      →  Standardize       →  rndStatus (Enum)
SALES                    →  Standardize       →  salesStatus (Enum)
OPEN / CLOSED            →  Standardize       →  status (Enum)
ACTIVITY                 →  Standardize       →  activity (Enum)
INHOUSE / BROUGHTOUT     →  Standardize       →  manufacturingType (Enum)
STANDARD / NON STANDARD
PRODUCT (SP / NSP)       →  Standardize       →  productType (Enum)
Days requiered...        →  Parse number      →  daysRequiredForFulfillment
REMARK                   →  Clean string      →  remarks
```

## Testing the Import

To test the updated import script:

```bash
cd server
node scripts/importFromExcel.js
```

The script will:
- ✅ Display all Excel column names found
- ✅ Map data using exact column names
- ✅ Standardize values to match database enums
- ✅ Create users for sales representatives
- ✅ Import all valid enquiries
- ✅ Show success/error statistics
- ✅ Display sample imported data

## Documentation

See `EXCEL_COLUMN_MAPPING.md` for complete field mapping reference including:
- All column names
- Value standardization rules
- Database field descriptions
- Enum value mappings
