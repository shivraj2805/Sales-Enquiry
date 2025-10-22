import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    enquiryNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true,
    },
    enquiryDate: {
      type: Date,
      required: [true, 'Please provide enquiry date'],
      default: Date.now,
    },
    marketType: {
      type: String,
      enum: ['Domestic', 'Export'],
      required: true,
    },
    productType: {
      type: String,
      enum: ['SP', 'NSP', 'SP+NSP', 'Other'],
      required: true,
    },
    supplyScope: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
    },
    estimatedValue: {
      type: Number,
    },
    salesRepresentative: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    salesRepName: {
      type: String,
      required: true,
    },
    rndHandler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rndHandlerName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
    activity: {
      type: String,
      enum: ['Quoted', 'Regretted', 'In Progress', 'On Hold'],
      default: 'In Progress',
    },
    quotationDate: {
      type: Date,
    },
    fulfillmentTime: {
      type: Number, // in days
    },
    closureDate: {
      type: Date,
    },
    remarks: {
      type: String,
      trim: true,
    },
    attachments: [
      {
        fileName: String,
        filePath: String,
        fileType: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate enquiry number before saving
enquirySchema.pre('save', async function (next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    // Find the last enquiry number for this month
    const lastEnquiry = await this.constructor
      .findOne({
        enquiryNumber: new RegExp(`^ENQ-${year}${month}-`),
      })
      .sort({ enquiryNumber: -1 });

    let sequence = 1;
    if (lastEnquiry) {
      const lastSequence = parseInt(lastEnquiry.enquiryNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    this.enquiryNumber = `ENQ-${year}${month}-${String(sequence).padStart(4, '0')}`;
  }
  next();
});

// Calculate fulfillment time before saving
enquirySchema.pre('save', function (next) {
  if (this.quotationDate && this.enquiryDate) {
    const diffTime = Math.abs(this.quotationDate - this.enquiryDate);
    this.fulfillmentTime = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
