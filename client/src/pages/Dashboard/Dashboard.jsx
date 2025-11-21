import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Assignment,
  CheckCircle,
  Cancel,
  TrendingUp,
  Timeline,
  Public,
  BusinessCenter,
  Speed,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { dashboardService } from '../../services/dashboardService';
import { toast } from 'react-toastify';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StatCard = ({ title, value, icon, color, bgColor }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}05 100%)`,
      border: `1px solid ${bgColor}30`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography 
            color="textSecondary" 
            gutterBottom 
            variant="body2"
            sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem' }}
          >
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {value}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            color,
            fontSize: 56,
            opacity: 0.8,
            background: `${color}15`,
            borderRadius: 3,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [teamPerformance, setTeamPerformance] = useState(null);
  const [marketAnalysis, setMarketAnalysis] = useState(null);
  const [trendAnalysis, setTrendAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, teamRes, marketRes, trendRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getTeamPerformance(),
        dashboardService.getMarketAnalysis(),
        dashboardService.getTrendAnalysis(),
      ]);
      
      setStats(statsRes);
      setTeamPerformance(teamRes);
      setMarketAnalysis(marketRes);
      setTrendAnalysis(trendRes);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: 600 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12, weight: 600 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 8,
      }
    },
    cutout: '65%',
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: { size: 12, weight: 600 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: 11 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } }
      }
    }
  };

  // Prepare chart data
  const monthlyTrendData = {
    labels: trendAnalysis?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Total Enquiries',
        data: trendAnalysis?.map(item => item.totalEnquiries) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Quoted',
        data: trendAnalysis?.map(item => item.quoted) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Regretted',
        data: trendAnalysis?.map(item => item.regretted) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const salesTeamData = {
    labels: teamPerformance?.salesTeam?.slice(0, 10).map(item => item._id) || [],
    datasets: [{
      label: 'Total Enquiries',
      data: teamPerformance?.salesTeam?.slice(0, 10).map(item => item.totalEnquiries) || [],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(244, 63, 94, 0.8)',
      ],
      borderRadius: 8,
      borderWidth: 0,
    }]
  };

  const rndTeamData = {
    labels: teamPerformance?.rndTeam?.map(item => item._id) || [],
    datasets: [{
      label: 'Enquiries Handled',
      data: teamPerformance?.rndTeam?.map(item => item.totalEnquiries) || [],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderRadius: 8,
      borderWidth: 0,
    }]
  };

  const activityDistributionData = {
    labels: ['Quoted', 'Regretted', 'In Progress', 'On Hold'],
    datasets: [{
      data: [
        stats?.quotedEnquiries || 0,
        stats?.regrettedEnquiries || 0,
        stats?.openEnquiries || 0,
        0
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.9)',
        'rgba(239, 68, 68, 0.9)',
        'rgba(59, 130, 246, 0.9)',
        'rgba(245, 158, 11, 0.9)',
      ],
      borderWidth: 0,
    }]
  };

  const marketDistributionData = {
    labels: ['Domestic', 'Export'],
    datasets: [{
      data: [
        stats?.marketDistribution?.domestic || 0,
        stats?.marketDistribution?.export || 0
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.9)',
        'rgba(16, 185, 129, 0.9)',
      ],
      borderWidth: 0,
    }]
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Loading Dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your enquiries today.
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Enquiries"
            value={stats?.totalEnquiries || 0}
            icon={<Assignment />}
            color="#3b82f6"
            bgColor="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Enquiries"
            value={stats?.openEnquiries || 0}
            icon={<Timeline />}
            color="#f59e0b"
            bgColor="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quoted"
            value={stats?.quotedEnquiries || 0}
            icon={<CheckCircle />}
            color="#10b981"
            bgColor="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Regretted"
            value={stats?.regrettedEnquiries || 0}
            icon={<Cancel />}
            color="#ef4444"
            bgColor="#ef4444"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4,
              height: '100%',
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba205 100%)',
              border: '1px solid #667eea20',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUp sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Key Metrics
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2.5, 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                  Closure Rate
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {stats?.closureRate || 0}%
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                  Average Fulfillment Time
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'secondary.main' }}>
                  {stats?.avgFulfillmentTime || 0} <Typography component="span" variant="h6">days</Typography>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 4,
              height: '100%',
              background: 'linear-gradient(135deg, #10b98115 0%, #10b98105 100%)',
              border: '1px solid #10b98120',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUp sx={{ fontSize: 32, color: 'secondary.main', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Market Distribution
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Box 
                sx={{ 
                  mb: 3, 
                  p: 2.5, 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                  Domestic Enquiries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                  {stats?.marketDistribution?.domestic || 0}
                </Typography>
              </Box>
              <Box 
                sx={{ 
                  p: 2.5, 
                  backgroundColor: 'white',
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                }}
              >
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600, mb: 1 }}>
                  Export Enquiries
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {stats?.marketDistribution?.export || 0}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          📊 Analytics & Insights
        </Typography>

        {/* Trend Analysis */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ fontSize: 28, color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Monthly Enquiry Trends
                </Typography>
              </Box>
              <Box sx={{ height: 350 }}>
                <Line data={monthlyTrendData} options={lineChartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Team Performance Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessCenter sx={{ fontSize: 28, color: 'secondary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Sales Team Performance
                </Typography>
              </Box>
              <Box sx={{ height: 350 }}>
                <Bar data={salesTeamData} options={barChartOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Speed sx={{ fontSize: 28, color: 'info.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  R&D Team Performance
                </Typography>
              </Box>
              <Box sx={{ height: 350 }}>
                <Bar data={rndTeamData} options={barChartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Distribution Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Assignment sx={{ fontSize: 28, color: 'warning.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Activity Status Distribution
                </Typography>
              </Box>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={activityDistributionData} options={doughnutOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Public sx={{ fontSize: 28, color: 'success.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Market Distribution
                </Typography>
              </Box>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie data={marketDistributionData} options={{
                  ...doughnutOptions,
                  cutout: '0%',
                }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Stats Summary */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba205 100%)',
                border: '1px solid #667eea20',
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                📈 Performance Highlights
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary" fontWeight={600}>
                      Success Rate
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mt: 1 }}>
                      {stats?.quotedEnquiries && stats?.totalEnquiries 
                        ? ((stats.quotedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
                        : 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary" fontWeight={600}>
                      Rejection Rate
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main', mt: 1 }}>
                      {stats?.regrettedEnquiries && stats?.totalEnquiries 
                        ? ((stats.regrettedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
                        : 0}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary" fontWeight={600}>
                      Active Sales Team
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mt: 1 }}>
                      {teamPerformance?.salesTeam?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                    <Typography variant="body2" color="textSecondary" fontWeight={600}>
                      Active R&D Team
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main', mt: 1 }}>
                      {teamPerformance?.rndTeam?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
