import Enquiry from '../models/Enquiry.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const openEnquiries = await Enquiry.countDocuments({ status: 'Open' });
    const closedEnquiries = await Enquiry.countDocuments({ status: 'Closed' });
    const quotedEnquiries = await Enquiry.countDocuments({ activity: 'Quoted' });
    const regrettedEnquiries = await Enquiry.countDocuments({ activity: 'Regretted' });

    // Calculate closure rate
    const closureRate = totalEnquiries > 0 ? ((closedEnquiries / totalEnquiries) * 100).toFixed(2) : 0;

    // Calculate average fulfillment time
    const enquiriesWithFulfillment = await Enquiry.find({ fulfillmentTime: { $exists: true, $ne: null } });
    const avgFulfillmentTime = enquiriesWithFulfillment.length > 0
      ? (enquiriesWithFulfillment.reduce((sum, enq) => sum + enq.fulfillmentTime, 0) / enquiriesWithFulfillment.length).toFixed(2)
      : 0;

    // Market distribution
    const domesticCount = await Enquiry.countDocuments({ marketType: 'Domestic' });
    const exportCount = await Enquiry.countDocuments({ marketType: 'Export' });

    res.status(200).json({
      success: true,
      data: {
        totalEnquiries,
        openEnquiries,
        closedEnquiries,
        quotedEnquiries,
        regrettedEnquiries,
        closureRate: parseFloat(closureRate),
        avgFulfillmentTime: parseFloat(avgFulfillmentTime),
        marketDistribution: {
          domestic: domesticCount,
          export: exportCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team performance
// @route   GET /api/dashboard/team-performance
// @access  Private
export const getTeamPerformance = async (req, res, next) => {
  try {
    const salesPerformance = await Enquiry.aggregate([
      {
        $group: {
          _id: '$salesRepName',
          totalEnquiries: { $sum: 1 },
          quotedEnquiries: {
            $sum: { $cond: [{ $eq: ['$activity', 'Quoted'] }, 1, 0] },
          },
          closedEnquiries: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] },
          },
        },
      },
      { $sort: { totalEnquiries: -1 } },
    ]);

    const rndPerformance = await Enquiry.aggregate([
      { $match: { rndHandlerName: { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$rndHandlerName',
          totalEnquiries: { $sum: 1 },
          avgFulfillmentTime: { $avg: '$fulfillmentTime' },
        },
      },
      { $sort: { totalEnquiries: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        salesTeam: salesPerformance,
        rndTeam: rndPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get market analysis
// @route   GET /api/dashboard/market-analysis
// @access  Private
export const getMarketAnalysis = async (req, res, next) => {
  try {
    const marketAnalysis = await Enquiry.aggregate([
      {
        $group: {
          _id: {
            marketType: '$marketType',
            productType: '$productType',
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$estimatedValue' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const activityByMarket = await Enquiry.aggregate([
      {
        $group: {
          _id: {
            marketType: '$marketType',
            activity: '$activity',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        marketAnalysis,
        activityByMarket,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trend analysis
// @route   GET /api/dashboard/trend-analysis
// @access  Private
export const getTrendAnalysis = async (req, res, next) => {
  try {
    const monthlyTrends = await Enquiry.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$enquiryDate' },
            month: { $month: '$enquiryDate' },
          },
          totalEnquiries: { $sum: 1 },
          quoted: {
            $sum: { $cond: [{ $eq: ['$activity', 'Quoted'] }, 1, 0] },
          },
          regretted: {
            $sum: { $cond: [{ $eq: ['$activity', 'Regretted'] }, 1, 0] },
          },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: monthlyTrends,
    });
  } catch (error) {
    next(error);
  }
};
