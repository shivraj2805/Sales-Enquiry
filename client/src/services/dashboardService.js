import api from '../utils/axios';

export const dashboardService = {
  // Get dashboard stats
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  // Get team performance
  getTeamPerformance: async () => {
    const response = await api.get('/dashboard/team-performance');
    return response.data;
  },

  // Get market analysis
  getMarketAnalysis: async () => {
    const response = await api.get('/dashboard/market-analysis');
    return response.data;
  },

  // Get trend analysis
  getTrendAnalysis: async () => {
    const response = await api.get('/dashboard/trend-analysis');
    return response.data;
  },
};
