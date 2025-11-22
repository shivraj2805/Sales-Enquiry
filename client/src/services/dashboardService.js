import api from '../utils/axios';

export const dashboardService = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data.data; // Return just the data
  },

  // Get team performance
  getTeamPerformance: async () => {
    const response = await api.get('/dashboard/team-performance');
    return response.data.data; // Return just the data
  },

  // Get market analysis
  getMarketAnalysis: async () => {
    const response = await api.get('/dashboard/market-analysis');
    return response.data.data; // Return just the data
  },

  // Get trend analysis
  getTrendAnalysis: async () => {
    const response = await api.get('/dashboard/trend-analysis');
    return response.data.data; // Return just the data
  },

  // Get activity distribution
  getActivityDistribution: async () => {
    const response = await api.get('/dashboard/activity-distribution');
    return response.data.data;
  },

  // Get product distribution
  getProductDistribution: async () => {
    const response = await api.get('/dashboard/product-distribution');
    return response.data.data;
  },

  // Get fulfillment analysis
  getFulfillmentAnalysis: async () => {
    const response = await api.get('/dashboard/fulfillment-analysis');
    return response.data.data;
  },
};
