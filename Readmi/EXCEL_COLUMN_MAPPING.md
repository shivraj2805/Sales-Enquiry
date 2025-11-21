# Excel Column to Database Field Mapping

This document maps the exact Excel column names to the MongoDB database fields used in the Sales Enquiry system.

## Excel Column Names (Exact)

Based on your Excel file, these are the **exact** column names:

1. **SR. No.** - Serial Number
2. **Enq No.** - Enquiry Number
3. **EXPORT / DOMESTIC** - Market Type
4. **PO No.** - Purchase Order Number
5. **DATE RECEIVED** - Date when enquiry was received
6. **DATE SUBMITTED** - Date when enquiry was submitted
7. **DRAWING** - Drawing department status
8. **COSTING** - Costing department status
9. **R&D** - Research & Development department status
10. **SALES** - Sales department status
11. **OPEN / CLOSED** - Enquiry status
12. **ACTIVITY** - Current activity status
13. **INHOUSE / BROUGHTOUT** - Manufacturing type
14. **STANDARD / NON STANDARD\nPRODUCT (SP / NSP)** - Product type (note: contains newline character)
15. **Days requiered for fullfillment** - Days required for fulfillment (note: "requiered" is misspelled in Excel)
16. **REMARK** - Remarks/Comments

## Database Field Mapping

| Excel Column | Database Field | Type | Notes |
|--------------|----------------|------|-------|
| **SR. No.** | N/A | - | Not stored (used only for reference) |
| **Enq No.** | `enquiryNumber` | String | Auto-generated if not provided (format: ENQ-YYYYMM-0001) |
| **EXPORT / DOMESTIC** | `marketType` | String (Enum) | Values: 'Domestic' or 'Export' |
| **PO No.** | `poNumber` | String | Optional |
| **DATE RECEIVED** | `dateReceived` | Date | Also used as `enquiryDate` |
| **DATE SUBMITTED** | `dateSubmitted` | Date | Optional |
| **DRAWING** | `drawingStatus` | String (Enum) | Values: 'Pending', 'In Progress', 'Completed', 'Not Required' |
| **COSTING** | `costingStatus` | String (Enum) | Values: 'Pending', 'In Progress', 'Completed', 'Not Required' |
| **R&D** | `rndStatus` | String (Enum) | Values: 'Pending', 'In Progress', 'Completed', 'Not Required' |
| **SALES** | `salesStatus` | String (Enum) | Values: 'Pending', 'In Progress', 'Completed', 'Not Required' |
| **OPEN / CLOSED** | `status` | String (Enum) | Values: 'Open' or 'Closed' |
| **ACTIVITY** | `activity` | String (Enum) | Values: 'Quoted', 'Regretted', 'In Progress', 'On Hold' |
| **INHOUSE / BROUGHTOUT** | `manufacturingType` | String (Enum) | Values: 'Inhouse', 'Broughtout', 'Both' |
| **STANDARD / NON STANDARD\nPRODUCT (SP / NSP)** | `productType` | String (Enum) | Values: 'SP', 'NSP', 'SP+NSP', 'Other' |
| **Days requiered for fullfillment** | `daysRequiredForFulfillment` | Number | Note: Excel has typo "requiered" |
| **REMARK** | `remarks` | String | Optional text field |

## Value Standardization

The import script automatically standardizes values from Excel to match database enums:

### Market Type (EXPORT / DOMESTIC)
- Excel: "Export", "EXPORT", "export" → Database: "Export"
- Excel: "Domestic", "DOMESTIC", "domestic", or any other value → Database: "Domestic"

### Product Type (STANDARD / NON STANDARD PRODUCT)
- Excel: "SP", "STANDARD", "standard" → Database: "SP"
- Excel: "NSP", "NON STANDARD", "NON-STANDARD", "non standard" → Database: "NSP"
- Excel: "SP+NSP", "BOTH" → Database: "SP+NSP"
- Default → Database: "SP"

### Department Status (DRAWING, COSTING, R&D, SALES)
- Excel: "completed", "done", "yes" → Database: "Completed"
- Excel: "pending", "waiting", "no" → Database: "Pending"
- Excel: "in progress", "wip" → Database: "In Progress"
- Excel: "not required", "n/a", "na" → Database: "Not Required"
- Default → Database: "Pending"

### Manufacturing Type (INHOUSE / BROUGHTOUT)
- Excel: "inhouse", "in-house" → Database: "Inhouse"
- Excel: "broughtout", "brought out" → Database: "Broughtout"
- Excel: "both" → Database: "Both"

### Enquiry Status (OPEN / CLOSED)
- Excel: "closed", "close" → Database: "Closed"
- Excel: "open" or any other value → Database: "Open"

### Activity Status (ACTIVITY)
- Excel: contains "quote" → Database: "Quoted"
- Excel: contains "regret" → Database: "Regretted"
- Excel: contains "progress" or "pending" → Database: "In Progress"
- Excel: contains "hold" → Database: "On Hold"
- Default → Database: "In Progress"

## Additional Database Fields Not in Excel

These fields are created/managed by the system and not present in Excel:

| Database Field | Type | Description |
|----------------|------|-------------|
| `customerName` | String | Customer name (set to 'N/A' if not in Excel) |
| `salesRepresentative` | ObjectId | Reference to User (Sales Rep) |
| `salesRepName` | String | Name of sales representative |
| `rndHandler` | ObjectId | Reference to User (R&D Handler) |
| `rndHandlerName` | String | Name of R&D handler |
| `createdBy` | ObjectId | User who created the enquiry |
| `updatedBy` | ObjectId | User who last updated |
| `createdAt` | Date | Auto-generated timestamp |
| `updatedAt` | Date | Auto-generated timestamp |
| `fulfillmentTime` | Number | Calculated field (days between enquiryDate and quotationDate) |
| `attachments` | Array | File attachments |

## Important Notes

1. **Column Name Case Sensitivity**: The Excel column names are case-sensitive and must match exactly, including spaces and special characters.

2. **Newline Characters**: The "STANDARD / NON STANDARD\nPRODUCT (SP / NSP)" column contains a newline character (`\n`) in the column name.

3. **Typo in Excel**: The column "Days requiered for fullfillment" contains a typo ("requiered" instead of "required"). The import script handles this exact spelling.

4. **Date Formats**: Dates are automatically parsed from Excel serial numbers or date strings.

5. **Required Fields**: The only truly required field from Excel is "DATE RECEIVED" (used as enquiry date). Other fields have defaults or are optional.

## Usage

When importing data, ensure your Excel file uses these **exact** column names. The import script in `server/scripts/importFromExcel.js` is configured to read these specific column names.

### Running the Import

```bash
cd server
node scripts/importFromExcel.js
```

The script will:
1. Read the Excel file from `server/data/`
2. Map columns using exact names
3. Standardize values to match database enums
4. Create users for sales reps and R&D handlers
5. Import all valid enquiries
6. Report success/failure statistics
