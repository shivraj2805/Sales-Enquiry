# Excel to System Field Mapping Guide

## Your Excel Structure → System Implementation

### ✅ Fully Supported Fields

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR EXCEL COLUMNS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SR. No.                    → Auto-generated serial number      │
│  Enq No.                    → enquiryNumber (ENQ-202511-0001)  │
│  EXPORT / DOMESTIC          → marketType (Domestic/Export)      │
│  PO No.                     → poNumber ✅ NEW                   │
│  DATE RECEIVED              → dateReceived ✅ NEW               │
│  DATE SUBMITTED             → dateSubmitted ✅ NEW              │
│  DRAWING                    → drawingStatus ✅ NEW              │
│  COSTING                    → costingStatus ✅ NEW              │
│  R&D                        → rndStatus ✅ NEW                  │
│  SALES                      → salesStatus ✅ NEW                │
│  OPEN / CLOSED              → status (Open/Closed)              │
│  ACTIVITY                   → activity (Quoted/Regretted/...)   │
│  INHOUSE / BROUGHTOUT       → manufacturingType ✅ NEW          │
│  STANDARD / NON STANDARD    → productType (SP/NSP/SP+NSP)       │
│  PRODUCT (SP / NSP)                                             │
│  Days requiered for         → daysRequiredForFulfillment ✅ NEW │
│  fullfillment                                                   │
│  REMARK                     → remarks                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Form Layout in System

### 📋 **Section 1: Basic Information**
```
┌─────────────────────────────────────────────────────┐
│  Customer Name*          │  Enquiry Date*          │
│  Market Type*            │  Product Type*          │
│  Supply Scope (full width)                         │
│  PO Number               │  Quantity               │  Estimated Value
│  Date Received           │  Date Submitted         │
│  Manufacturing Type      │  Days Required          │
└─────────────────────────────────────────────────────┘
```

### 🏢 **Section 2: Department Status** ✅ NEW
```
┌─────────────────────────────────────────────────────┐
│  Drawing Status    │  Costing Status               │
│  R&D Status        │  Sales Status                 │
│                                                     │
│  Each with options:                                │
│  • Pending (⚠️ Yellow)                             │
│  • In Progress (ℹ️ Blue)                           │
│  • Completed (✅ Green)                             │
│  • Not Required (⚪ Grey)                          │
└─────────────────────────────────────────────────────┘
```

### 👥 **Section 3: Team Assignment**
```
┌─────────────────────────────────────────────────────┐
│  Sales Representative*   │  R&D Handler            │
└─────────────────────────────────────────────────────┘
```

### 📊 **Section 4: Status & Activity**
```
┌─────────────────────────────────────────────────────┐
│  Activity               │  Status (Auto-set)        │
│  Quote Date             │  Closure Date             │
└─────────────────────────────────────────────────────┘
```

### 📝 **Section 5: Additional Information**
```
┌─────────────────────────────────────────────────────┐
│  Remarks (multi-line)                               │
│  Delay Remarks (multi-line)                         │
└─────────────────────────────────────────────────────┘
```

## Data Grid View (Enquiry List)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Enquiry # │ Date │ Customer │ PO No │ Market │ Product │ Manufacturing │...  │
├──────────────────────────────────────────────────────────────────────────────┤
│ ENQ-...   │ Date │ ABC Ltd  │ PO123 │ Export │ SP      │ Inhouse       │...  │
└──────────────────────────────────────────────────────────────────────────────┘

... │ Drawing │ Costing │ R&D │ Sales │ Activity │ Status │ Sales Rep │ Actions │
... │ ✅ Done │ 🔵 WIP  │ ⚠️  │ ⚠️    │ Quoted   │ Closed │ John Doe  │ 👁️ ✏️ 🗑️ │
```

## Department Status Color Coding

```
🟢 Completed      ✅ Work finished
🔵 In Progress    ⚙️ Currently working
🟡 Pending        ⏳ Not started yet
⚪ Not Required   ➖ Not applicable
```

## Import Process Flow

```
1. Excel File Upload
   ↓
2. Column Detection (Automatic)
   • "EXPORT / DOMESTIC" → marketType
   • "STANDARD / NON STANDARD PRODUCT" → productType
   • "INHOUSE / BROUGHTOUT" → manufacturingType
   • "Days requiered for fullfillment" → daysRequiredForFulfillment
   • All department columns → respective status fields
   ↓
3. Data Validation
   • Required fields check
   • Date parsing
   • Enum value standardization
   ↓
4. User/Team Creation
   • Auto-create sales reps if not exist
   • Auto-create R&D handlers if not exist
   ↓
5. Import Complete
   • Success count
   • Error report
   • Sample data display
```

## Field Type Reference

### Text Fields
- Customer Name
- PO Number
- Supply Scope
- Remarks

### Date Fields
- Enquiry Date
- Date Received
- Date Submitted
- Quote Date
- Closure Date

### Number Fields
- Quantity
- Estimated Value
- Days Required for Fulfillment

### Dropdown/Select Fields
- Market Type: Domestic | Export
- Product Type: SP | NSP | SP+NSP | Other
- Manufacturing Type: Inhouse | Broughtout | Both
- Drawing Status: Pending | In Progress | Completed | Not Required
- Costing Status: Pending | In Progress | Completed | Not Required
- R&D Status: Pending | In Progress | Completed | Not Required
- Sales Status: Pending | In Progress | Completed | Not Required
- Activity: In Progress | On Hold | Quoted | Regretted
- Status: Open | Closed

### Reference Fields (Dropdowns)
- Sales Representative (links to User)
- R&D Handler (links to User)

## Auto-Generated Fields
- Enquiry Number: ENQ-YYYYMM-XXXX
- Actual Fulfillment Time: (Quote Date - Enquiry Date) in days
- Created/Updated timestamps

## Business Rules

### Rule 1: Status Auto-Update
```
IF Activity = "Quoted" OR "Regretted"
THEN Status = "Closed"
ELSE Status = "Open"
```

### Rule 2: Closure Date
```
Closure Date is ONLY editable when Status = "Closed"
```

### Rule 3: Fulfillment Time Calculation
```
IF Quote Date AND Enquiry Date exist
THEN fulfillmentTime = Quote Date - Enquiry Date (in days)
```

## Example Data Row

```javascript
{
  // Your Excel Columns
  "SR. No.": 1,
  "Enq No.": "Should be auto-generated",
  "EXPORT / DOMESTIC": "Export",
  "PO No.": "PO-2024-001",
  "DATE RECEIVED": "2024-11-01",
  "DATE SUBMITTED": "2024-11-15",
  "DRAWING": "Completed",
  "COSTING": "In Progress",
  "R&D": "Completed",
  "SALES": "Completed",
  "OPEN / CLOSED": "Open",
  "ACTIVITY": "In Progress",
  "INHOUSE / BROUGHTOUT": "Inhouse",
  "STANDARD / NON STANDARD PRODUCT (SP / NSP)": "SP",
  "Days requiered for fullfillment": 30,
  "REMARK": "Customer requested fast delivery"
}

// Maps to System as:
{
  enquiryNumber: "ENQ-202411-0001",
  poNumber: "PO-2024-001",
  customerName: "ABC Corporation",
  enquiryDate: "2024-11-01",
  dateReceived: "2024-11-01",
  dateSubmitted: "2024-11-15",
  marketType: "Export",
  productType: "SP",
  manufacturingType: "Inhouse",
  drawingStatus: "Completed",
  costingStatus: "In Progress",
  rndStatus: "Completed",
  salesStatus: "Completed",
  status: "Open",
  activity: "In Progress",
  daysRequiredForFulfillment: 30,
  remarks: "Customer requested fast delivery"
}
```

## Quick Reference Chart

| What You Have | What It's Called in System |
|---------------|----------------------------|
| EXPORT / DOMESTIC | Market Type |
| STANDARD / NON STANDARD | Product Type |
| INHOUSE / BROUGHTOUT | Manufacturing Type |
| DRAWING | Drawing Status |
| COSTING | Costing Status |
| R&D | R&D Status |
| SALES | Sales Status |
| OPEN / CLOSED | Status |
| ACTIVITY | Activity |
| Days requiered | Days Required for Fulfillment |

---

✅ All fields from your Excel structure are now fully supported!
🎨 Color-coded UI makes status tracking intuitive
📊 Complete data import/export capability
🔄 Automatic value standardization during import
