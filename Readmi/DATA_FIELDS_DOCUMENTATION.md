# Sales Enquiry Data Fields Documentation

This document provides a comprehensive overview of all data fields supported by the Sales Enquiry Management System.

## Complete Field List

### 1. Basic Identification
- **SR. No.** - Serial Number (Auto-generated)
- **Enq No.** - Enquiry Number (Format: ENQ-YYYYMM-XXXX)
- **PO No.** - Purchase Order Number

### 2. Dates
- **DATE RECEIVED** - Date when enquiry was received
- **DATE SUBMITTED** - Date when quote/response was submitted to customer
- **Enquiry Date** - Date when enquiry was created in system
- **Quote Date** - Date when quotation was sent
- **Closure Date** - Date when enquiry was closed

### 3. Customer Information
- **Customer Name** - Name of the customer/company
- **EXPORT / DOMESTIC** - Market Type
  - Export
  - Domestic

### 4. Product Information
- **STANDARD / NON STANDARD PRODUCT (SP / NSP)**
  - SP - Standard Product
  - NSP - Non-Standard Product
  - SP+NSP - Both
  - Other

### 5. Department Status Fields
- **DRAWING** - Drawing preparation status
  - Pending
  - In Progress
  - Completed
  - Not Required

- **COSTING** - Costing analysis status
  - Pending
  - In Progress
  - Completed
  - Not Required

- **R&D** - Research & Development status
  - Pending
  - In Progress
  - Completed
  - Not Required

- **SALES** - Sales department status
  - Pending
  - In Progress
  - Completed
  - Not Required

### 6. Manufacturing
- **INHOUSE / BROUGHTOUT** - Manufacturing type
  - Inhouse - Manufactured in-house
  - Broughtout - Outsourced/Purchased
  - Both - Combination of both

### 7. Status & Activity
- **OPEN / CLOSED** - Overall enquiry status
  - Open - Enquiry is active
  - Closed - Enquiry is completed

- **ACTIVITY** - Current activity status
  - In Progress - Actively being worked on
  - On Hold - Temporarily paused
  - Quoted - Quote has been sent
  - Regretted - Declined/Rejected

### 8. Timeline & Planning
- **Days required for fulfillment** - Expected number of days to fulfill the order
- **Actual Fulfillment Time** - Auto-calculated based on Quote Date - Enquiry Date

### 9. Additional Information
- **Supply Scope** - Details of what will be supplied
- **Quantity** - Number of units
- **Estimated Value** - Expected order value
- **REMARK** - General remarks/notes

### 10. Team Assignment
- **Sales Representative** - Assigned sales person
- **R&D Handler** - Assigned R&D person

## Field Mapping for Excel Import

When importing from Excel, the system maps columns as follows:

| Excel Column | System Field | Type |
|--------------|--------------|------|
| SR. No. | Auto-generated | Number |
| Enq No. | enquiryNumber | String |
| EXPORT / DOMESTIC | marketType | Enum |
| PO No. | poNumber | String |
| DATE RECEIVED | dateReceived | Date |
| DATE SUBMITTED | dateSubmitted | Date |
| DRAWING | drawingStatus | Enum |
| COSTING | costingStatus | Enum |
| R&D | rndStatus | Enum |
| SALES | salesStatus | Enum |
| OPEN / CLOSED | status | Enum |
| ACTIVITY | activity | Enum |
| INHOUSE / BROUGHTOUT | manufacturingType | Enum |
| STANDARD / NON STANDARD PRODUCT (SP / NSP) | productType | Enum |
| Days requiered for fullfillment | daysRequiredForFulfillment | Number |
| REMARK | remarks | Text |

## Data Validation Rules

### Required Fields
- Customer Name
- Enquiry Date
- Market Type (Domestic/Export)
- Product Type (SP/NSP/SP+NSP/Other)
- Sales Representative

### Optional Fields
- All other fields are optional and can be filled as information becomes available

### Auto-calculated Fields
- **Enquiry Number** - Auto-generated in format ENQ-YYYYMM-XXXX
- **Actual Fulfillment Time** - Auto-calculated when both Enquiry Date and Quotation Date are present

### Business Logic
1. When Activity is set to "Quoted" or "Regretted", Status automatically becomes "Closed"
2. When Activity is "In Progress" or "On Hold", Status remains "Open"
3. Closure Date is only enabled when Status is "Closed"

## Using the System

### Creating a New Enquiry
1. Navigate to Enquiries → New Enquiry
2. Fill in all required fields (marked with *)
3. Fill in optional fields as available
4. Department status fields default to "Pending"
5. Submit to create the enquiry

### Importing from Excel
1. Prepare Excel file with column headers matching the structure above
2. Navigate to Enquiries → Import
3. Select your Excel file (.xls or .xlsx)
4. System will automatically map columns and import data
5. Review import summary for any errors

### Updating Department Status
1. Open an enquiry for editing
2. Navigate to "Department Status" section
3. Update status for Drawing, Costing, R&D, and Sales departments
4. Save changes

## Reports and Analytics

The system provides insights based on:
- Department status completion rates
- Fulfillment time analysis
- Market type distribution
- Product type breakdown
- Activity status overview

## API Endpoints

### Create Enquiry
```
POST /api/enquiries
```

### Update Enquiry
```
PUT /api/enquiries/:id
```

### Import from Excel
```
POST /api/enquiries/import
```

### Get All Enquiries
```
GET /api/enquiries
```

## Database Schema

```javascript
{
  enquiryNumber: String (auto-generated),
  poNumber: String,
  customerName: String (required),
  enquiryDate: Date (required),
  dateReceived: Date,
  dateSubmitted: Date,
  marketType: Enum ['Domestic', 'Export'] (required),
  productType: Enum ['SP', 'NSP', 'SP+NSP', 'Other'] (required),
  supplyScope: String,
  quantity: Number,
  estimatedValue: Number,
  drawingStatus: Enum ['Pending', 'In Progress', 'Completed', 'Not Required'],
  costingStatus: Enum ['Pending', 'In Progress', 'Completed', 'Not Required'],
  rndStatus: Enum ['Pending', 'In Progress', 'Completed', 'Not Required'],
  salesStatus: Enum ['Pending', 'In Progress', 'Completed', 'Not Required'],
  manufacturingType: Enum ['Inhouse', 'Broughtout', 'Both'],
  salesRepresentative: ObjectId (required),
  rndHandler: ObjectId,
  status: Enum ['Open', 'Closed'],
  activity: Enum ['Quoted', 'Regretted', 'In Progress', 'On Hold'],
  quotationDate: Date,
  fulfillmentTime: Number (auto-calculated),
  daysRequiredForFulfillment: Number,
  closureDate: Date,
  remarks: String
}
```

## Change Log

### Version 2.0 (Current)
- Added PO Number field
- Added Date Received field
- Added Date Submitted field
- Added Department Status fields (Drawing, Costing, R&D, Sales)
- Added Manufacturing Type field
- Added Days Required for Fulfillment field
- Enhanced Excel import to support all new fields
- Updated UI to display all fields

### Version 1.0
- Basic enquiry management
- Customer information
- Team assignment
- Status tracking
