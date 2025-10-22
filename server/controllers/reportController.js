import Enquiry from '../models/Enquiry.js';

// @desc    Generate custom report
// @route   POST /api/reports/generate
// @access  Private (Admin, Management)
export const generateReport = async (req, res, next) => {
  try {
    const { startDate, endDate, marketType, productType, status } = req.body;

    const filter = {};
    if (startDate || endDate) {
      filter.enquiryDate = {};
      if (startDate) filter.enquiryDate.$gte = new Date(startDate);
      if (endDate) filter.enquiryDate.$lte = new Date(endDate);
    }
    if (marketType) filter.marketType = marketType;
    if (productType) filter.productType = productType;
    if (status) filter.status = status;

    const enquiries = await Enquiry.find(filter)
      .populate('salesRepresentative', 'name')
      .populate('rndHandler', 'name')
      .sort({ enquiryDate: -1 });

    const summary = {
      totalEnquiries: enquiries.length,
      quoted: enquiries.filter(e => e.activity === 'Quoted').length,
      regretted: enquiries.filter(e => e.activity === 'Regretted').length,
      avgFulfillmentTime: enquiries.reduce((sum, e) => sum + (e.fulfillmentTime || 0), 0) / enquiries.length || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        summary,
        enquiries,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export data
// @route   POST /api/reports/export
// @access  Private
export const exportData = async (req, res, next) => {
  try {
    const { format, filters } = req.body;

    // This is a placeholder - actual implementation will include
    // Excel/PDF/CSV generation using libraries like exceljs, pdfkit, etc.

    res.status(200).json({
      success: true,
      message: `Export to ${format} - to be implemented`,
      data: filters,
    });
  } catch (error) {
    next(error);
  }
};
