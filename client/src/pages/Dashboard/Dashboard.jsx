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
  Chip,
  LinearProgress,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
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
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  PieChart,
  BarChart,
  Assessment,
  Refresh,
  CalendarMonth,
  ScatterPlot,
  BarChartOutlined,
  Analytics,
  Equalizer,
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
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2';
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
  ChartTooltip,
  Legend,
  Filler,
  RadialLinearScale
);

const StatCard = ({ title, value, icon, color, bgColor, trend, trendValue }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${bgColor}15 0%, ${bgColor}05 100%)`,
      border: `1px solid ${bgColor}30`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: `0 12px 24px ${bgColor}20`,
        borderColor: `${bgColor}50`,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: `radial-gradient(circle, ${bgColor}10 0%, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
      }
    }}
  >
    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          color="textSecondary" 
          variant="body2"
          sx={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.5px' }}
        >
          {title}
        </Typography>
        {trend && (
          <Chip
            icon={trend === 'up' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
            label={trendValue}
            size="small"
            sx={{
              backgroundColor: trend === 'up' ? '#10b98120' : '#ef444420',
              color: trend === 'up' ? '#10b981' : '#ef4444',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: '22px',
              '& .MuiChip-icon': {
                fontSize: 14,
                marginLeft: '4px'
              }
            }}
          />
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            {value}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            color,
            fontSize: 48,
            opacity: 0.9,
            background: `${color}15`,
            borderRadius: 2.5,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'rotate(10deg) scale(1.1)',
            }
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
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '600', family: 'Inter' },
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 16,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.y;
            return label;
          }
        }
      }
    },
  };

  const lineChartOptions = {
    ...commonChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(0,0,0,0.04)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 7,
        borderWidth: 2,
        hoverBorderWidth: 3,
      }
    }
  };

  const barChartOptions = {
    ...commonChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: 'rgba(0,0,0,0.04)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: { size: 12, weight: '600', family: 'Inter' },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label}: ${value} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 16,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '70%',
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '600', family: 'Inter' }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.9)',
        padding: 16,
        cornerRadius: 12,
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
        angleLines: {
          color: 'rgba(0,0,0,0.1)',
        },
        ticks: {
          font: { size: 10, family: 'Inter' },
          backdropColor: 'transparent',
        }
      }
    },
    elements: {
      line: {
        borderWidth: 3,
        tension: 0.2
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      }
    }
  };

  const scatterOptions = {
    ...commonChartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Outcome Count',
          font: { size: 13, weight: '600', family: 'Inter' }
        },
        grid: { 
          color: 'rgba(0,0,0,0.04)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      },
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Total Enquiries',
          font: { size: 13, weight: '600', family: 'Inter' }
        },
        grid: { 
          color: 'rgba(0,0,0,0.04)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      }
    }
  };

  const stackedBarOptions = {
    ...commonChartOptions,
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        grid: { 
          color: 'rgba(0,0,0,0.04)',
          drawBorder: false,
        },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      },
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { 
          font: { size: 11, family: 'Inter' },
          padding: 10,
        },
        border: { display: false }
      }
    },
    elements: {
      bar: {
        borderRadius: 6,
        borderSkipped: false,
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
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Quoted',
        data: trendAnalysis?.map(item => item.quoted) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Regretted',
        data: trendAnalysis?.map(item => item.regretted) || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      }
    ]
  };

  const conversionFunnelData = {
    labels: ['Total', 'In Progress', 'Quoted', 'Regretted'],
    datasets: [{
      label: 'Enquiry Funnel',
      data: [
        stats?.totalEnquiries || 0,
        stats?.openEnquiries || 0,
        stats?.quotedEnquiries || 0,
        stats?.regrettedEnquiries || 0,
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderColor: [
        '#3b82f6',
        '#f59e0b',
        '#10b981',
        '#ef4444',
      ],
      borderWidth: 2,
      borderRadius: 10,
    }]
  };

  const salesTeamData = {
    labels: teamPerformance?.salesTeam?.slice(0, 10).map(item => item._id) || [],
    datasets: [{
      label: 'Total Enquiries',
      data: teamPerformance?.salesTeam?.slice(0, 10).map(item => item.totalEnquiries) || [],
      backgroundColor: [
        'rgba(59, 130, 246, 0.85)',
        'rgba(16, 185, 129, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(139, 92, 246, 0.85)',
        'rgba(236, 72, 153, 0.85)',
        'rgba(14, 165, 233, 0.85)',
        'rgba(34, 197, 94, 0.85)',
        'rgba(251, 146, 60, 0.85)',
        'rgba(168, 85, 247, 0.85)',
        'rgba(244, 63, 94, 0.85)',
      ],
      borderRadius: 10,
      borderWidth: 0,
      hoverBackgroundColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(14, 165, 233, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(251, 146, 60, 1)',
        'rgba(168, 85, 247, 1)',
        'rgba(244, 63, 94, 1)',
      ],
    }]
  };

  const rndTeamData = {
    labels: teamPerformance?.rndTeam?.map(item => item._id) || [],
    datasets: [{
      label: 'Enquiries Handled',
      data: teamPerformance?.rndTeam?.map(item => item.totalEnquiries) || [],
      backgroundColor: [
        'rgba(16, 185, 129, 0.85)',
        'rgba(59, 130, 246, 0.85)',
        'rgba(245, 158, 11, 0.85)',
        'rgba(139, 92, 246, 0.85)',
      ],
      borderRadius: 10,
      borderWidth: 0,
      hoverBackgroundColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(245, 158, 11, 1)',
        'rgba(139, 92, 246, 1)',
      ],
    }]
  };

  const teamComparisonData = {
    labels: ['Quoted', 'Regretted', 'In Progress'],
    datasets: [
      {
        label: 'Sales Performance',
        data: [
          stats?.quotedEnquiries || 0,
          stats?.regrettedEnquiries || 0,
          stats?.openEnquiries || 0,
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: '#3b82f6',
        borderWidth: 2,
      }
    ]
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
      hoverOffset: 15,
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
      hoverOffset: 15,
    }]
  };

  const topProductsData = {
    labels: marketAnalysis?.topProducts?.slice(0, 6).map(p => p._id || 'Unknown') || [],
    datasets: [{
      label: 'Product Enquiries',
      data: marketAnalysis?.topProducts?.slice(0, 6).map(p => p.count) || [],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
      ],
      borderColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#8b5cf6',
        '#ec4899',
        '#0ea5e9',
      ],
      borderWidth: 2,
    }]
  };

  // Control Chart Data - Shows process variation over time with control limits
  const controlChartData = {
    labels: trendAnalysis?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Quoted Enquiries',
        data: trendAnalysis?.map(item => item.quoted) || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
      },
      {
        label: 'Upper Control Limit (UCL)',
        data: trendAnalysis?.map(item => {
          const avg = trendAnalysis.reduce((sum, t) => sum + t.quoted, 0) / trendAnalysis.length;
          const variance = trendAnalysis.reduce((sum, t) => sum + Math.pow(t.quoted - avg, 2), 0) / trendAnalysis.length;
          const stdDev = Math.sqrt(variance);
          return avg + (2 * stdDev);
        }) || [],
        borderColor: '#ef4444',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Mean',
        data: trendAnalysis?.map(() => {
          const avg = trendAnalysis.reduce((sum, t) => sum + t.quoted, 0) / trendAnalysis.length;
          return avg;
        }) || [],
        borderColor: '#3b82f6',
        borderWidth: 2,
        borderDash: [10, 5],
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Lower Control Limit (LCL)',
        data: trendAnalysis?.map(item => {
          const avg = trendAnalysis.reduce((sum, t) => sum + t.quoted, 0) / trendAnalysis.length;
          const variance = trendAnalysis.reduce((sum, t) => sum + Math.pow(t.quoted - avg, 2), 0) / trendAnalysis.length;
          const stdDev = Math.sqrt(variance);
          return Math.max(0, avg - (2 * stdDev));
        }) || [],
        borderColor: '#f59e0b',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      }
    ]
  };

  // Histogram Data - Frequency distribution of enquiry counts
  const histogramData = {
    labels: ['0-10', '11-20', '21-30', '31-40', '41-50', '50+'],
    datasets: [{
      label: 'Frequency Distribution',
      data: (() => {
        const enquiryCounts = trendAnalysis?.map(item => item.totalEnquiries) || [];
        return [
          enquiryCounts.filter(c => c <= 10).length,
          enquiryCounts.filter(c => c > 10 && c <= 20).length,
          enquiryCounts.filter(c => c > 20 && c <= 30).length,
          enquiryCounts.filter(c => c > 30 && c <= 40).length,
          enquiryCounts.filter(c => c > 40 && c <= 50).length,
          enquiryCounts.filter(c => c > 50).length,
        ];
      })(),
      backgroundColor: [
        'rgba(59, 130, 246, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(236, 72, 153, 0.7)',
        'rgba(239, 68, 68, 0.7)',
      ],
      borderColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#8b5cf6',
        '#ec4899',
        '#ef4444',
      ],
      borderWidth: 2,
      borderRadius: 8,
    }]
  };

  // Scatter Plot Data - Correlation between quoted and regretted enquiries
  const scatterPlotData = {
    datasets: [
      {
        label: 'Quoted vs Total',
        data: trendAnalysis?.map(item => ({
          x: item.totalEnquiries,
          y: item.quoted
        })) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: '#10b981',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
      {
        label: 'Regretted vs Total',
        data: trendAnalysis?.map(item => ({
          x: item.totalEnquiries,
          y: item.regretted
        })) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: '#ef4444',
        borderWidth: 2,
        pointRadius: 8,
        pointHoverRadius: 12,
      }
    ]
  };

  // Stacked Bar Chart Data - Monthly breakdown
  const stackedBarData = {
    labels: trendAnalysis?.map(item => `${item._id.month}/${item._id.year}`) || [],
    datasets: [
      {
        label: 'Quoted',
        data: trendAnalysis?.map(item => item.quoted) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Regretted',
        data: trendAnalysis?.map(item => item.regretted) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'In Progress',
        data: trendAnalysis?.map(item => item.totalEnquiries - item.quoted - item.regretted) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 6,
      }
    ]
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
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Assessment sx={{ fontSize: 40, color: 'primary.main' }} />
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your enquiries today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Chip 
            icon={<CalendarMonth />} 
            label={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            variant="outlined"
            sx={{ fontWeight: 600 }}
          />
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={fetchAllData}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': { backgroundColor: 'primary.dark' }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Enquiries"
            value={stats?.totalEnquiries || 0}
            icon={<Assignment sx={{ fontSize: 48 }} />}
            color="#3b82f6"
            bgColor="#3b82f6"
            trend="up"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Enquiries"
            value={stats?.openEnquiries || 0}
            icon={<Timeline sx={{ fontSize: 48 }} />}
            color="#f59e0b"
            bgColor="#f59e0b"
            trend="up"
            trendValue="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Quoted"
            value={stats?.quotedEnquiries || 0}
            icon={<CheckCircle sx={{ fontSize: 48 }} />}
            color="#10b981"
            bgColor="#10b981"
            trend="up"
            trendValue="+15%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Regretted"
            value={stats?.regrettedEnquiries || 0}
            icon={<Cancel sx={{ fontSize: 48 }} />}
            color="#ef4444"
            bgColor="#ef4444"
            trend="down"
            trendValue="-5%"
          />
        </Grid>
      </Grid>

      {/* Key Performance Indicators */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3,
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ShowChart sx={{ fontSize: 28, color: 'primary.main', mr: 1.5 }} />
              <Typography variant="h6" fontWeight="bold">
                Performance Metrics
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                    Closure Rate
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
                    {stats?.closureRate || 0}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats?.closureRate || 0} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: '#e0e7ff',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#3b82f6',
                        borderRadius: 3,
                      }
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f0fdf4', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main', mb: 1 }}>
                    {stats?.quotedEnquiries && stats?.totalEnquiries 
                      ? ((stats.quotedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
                      : 0}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats?.quotedEnquiries && stats?.totalEnquiries 
                      ? (stats.quotedEnquiries / stats.totalEnquiries) * 100
                      : 0} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: '#dcfce7',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#10b981',
                        borderRadius: 3,
                      }
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fef2f2', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                    Rejection Rate
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'error.main', mb: 1 }}>
                    {stats?.regrettedEnquiries && stats?.totalEnquiries 
                      ? ((stats.regrettedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
                      : 0}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats?.regrettedEnquiries && stats?.totalEnquiries 
                      ? (stats.regrettedEnquiries / stats.totalEnquiries) * 100
                      : 0} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: '#fee2e2',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ef4444',
                        borderRadius: 3,
                      }
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#fffbeb', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                    Avg Time
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'warning.main' }}>
                    {stats?.avgFulfillmentTime || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" fontWeight={600}>
                    days to fulfill
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
              <Public sx={{ fontSize: 150 }} />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Public sx={{ fontSize: 28, mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Market Overview
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
                  Domestic Market
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  {stats?.marketDistribution?.domestic || 0}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats?.marketDistribution?.domestic && stats?.totalEnquiries
                    ? (stats.marketDistribution.domestic / stats.totalEnquiries) * 100
                    : 0} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
              <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', my: 2 }} />
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1, fontWeight: 600 }}>
                  Export Market
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                  {stats?.marketDistribution?.export || 0}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={stats?.marketDistribution?.export && stats?.totalEnquiries
                    ? (stats.marketDistribution.export / stats.totalEnquiries) * 100
                    : 0} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'white',
                      borderRadius: 4,
                    }
                  }} 
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <PieChart sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h5" fontWeight="bold">
            Analytics & Insights
          </Typography>
        </Box>

        {/* Trend Analysis & Conversion Funnel */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShowChart sx={{ fontSize: 28, color: 'primary.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Monthly Enquiry Trends
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Track enquiry performance over time
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 400 }}>
                <Line data={monthlyTrendData} options={lineChartOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BarChart sx={{ fontSize: 28, color: 'warning.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Conversion Funnel
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Enquiry processing stages
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 400 }}>
                <Bar 
                  data={conversionFunnelData} 
                  options={{
                    ...barChartOptions,
                    indexAxis: 'y',
                    plugins: {
                      ...barChartOptions.plugins,
                      legend: { display: false }
                    }
                  }} 
                />
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
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BusinessCenter sx={{ fontSize: 28, color: 'secondary.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Sales Team Performance
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Top 10 performing sales members
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 380 }}>
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
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Speed sx={{ fontSize: 28, color: 'info.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    R&D Team Performance
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Technical team workload distribution
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 380 }}>
                <Bar data={rndTeamData} options={barChartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Distribution and Analysis Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Assignment sx={{ fontSize: 28, color: 'warning.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Status Distribution
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Current enquiry breakdown
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Doughnut data={activityDistributionData} options={doughnutOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Public sx={{ fontSize: 28, color: 'success.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Market Split
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Domestic vs Export ratio
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Pie data={marketDistributionData} options={{
                  ...doughnutOptions,
                  cutout: '0%',
                }} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ fontSize: 28, color: 'primary.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Performance Radar
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Multi-dimensional analysis
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Radar data={teamComparisonData} options={radarOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Products Analysis */}
        {marketAnalysis?.topProducts && marketAnalysis.topProducts.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Paper 
                sx={{ 
                  p: 3,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <BarChart sx={{ fontSize: 28, color: 'secondary.main', mr: 1.5 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Top Products by Enquiries
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Most requested products
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ height: 300 }}>
                  <PolarArea data={topProductsData} options={{
                    ...commonChartOptions,
                    scales: {
                      r: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.1)' },
                        ticks: {
                          font: { size: 10, family: 'Inter' },
                          backdropColor: 'transparent',
                        }
                      }
                    }
                  }} />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Advanced Analytics Section */}
        <Box sx={{ mt: 4, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <Analytics sx={{ fontSize: 32, color: 'secondary.main' }} />
            <Typography variant="h5" fontWeight="bold">
              Advanced Analytics
            </Typography>
          </Box>
        </Box>

        {/* Control Chart & Histogram */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShowChart sx={{ fontSize: 28, color: 'error.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Statistical Process Control Chart
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Monitor process stability with control limits
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 380 }}>
                <Line data={controlChartData} options={lineChartOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <BarChartOutlined sx={{ fontSize: 28, color: 'info.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Enquiry Distribution
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Frequency histogram analysis
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 380 }}>
                <Bar data={histogramData} options={barChartOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Scatter Plot & Stacked Bar Chart */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ScatterPlot sx={{ fontSize: 28, color: 'warning.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Outcome Correlation Analysis
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Relationship between total enquiries and outcomes
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 380 }}>
                <Scatter data={scatterPlotData} options={scatterOptions} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper 
              sx={{ 
                p: 3,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Equalizer sx={{ fontSize: 28, color: 'success.main', mr: 1.5 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Monthly Status Breakdown
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Stacked composition over time
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ height: 380 }}>
                <Bar data={stackedBarData} options={stackedBarOptions} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Performance Highlights Summary */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 4,
                background: 'linear-gradient(135deg, #667eea15 0%, #764ba205 100%)',
                border: '1px solid #667eea20',
                borderRadius: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ fontSize: 32, color: 'primary.main', mr: 1.5 }} />
                <Typography variant="h6" fontWeight="bold">
                  Team Performance Highlights
                </Typography>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      backgroundColor: 'white', 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, backgroundColor: '#10b98115', color: 'success.main' }}>
                      <CheckCircle sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                      Success Rate
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'success.main', mt: 1 }}>
                      {stats?.quotedEnquiries && stats?.totalEnquiries 
                        ? ((stats.quotedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
                        : 0}%
                    </Typography>
                    <Chip 
                      label="↑ +5% from last month" 
                      size="small" 
                      sx={{ mt: 2, backgroundColor: '#10b98115', color: 'success.main', fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      backgroundColor: 'white', 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, backgroundColor: '#ef444415', color: 'error.main' }}>
                      <Cancel sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                      Rejection Rate
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'error.main', mt: 1 }}>
                      {stats?.regrettedEnquiries && stats?.totalEnquiries 
                        ? ((stats.regrettedEnquiries / stats.totalEnquiries) * 100).toFixed(1)
                        : 0}%
                    </Typography>
                    <Chip 
                      label="↓ -3% from last month" 
                      size="small" 
                      sx={{ mt: 2, backgroundColor: '#10b98115', color: 'success.main', fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      backgroundColor: 'white', 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, backgroundColor: '#3b82f615', color: 'info.main' }}>
                      <BusinessCenter sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                      Sales Team Size
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'info.main', mt: 1 }}>
                      {teamPerformance?.salesTeam?.length || 0}
                    </Typography>
                    <Chip 
                      label="Active members" 
                      size="small" 
                      sx={{ mt: 2, backgroundColor: '#3b82f615', color: 'info.main', fontWeight: 600 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box 
                    sx={{ 
                      textAlign: 'center', 
                      p: 3, 
                      backgroundColor: 'white', 
                      borderRadius: 3,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                      }
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56, mx: 'auto', mb: 2, backgroundColor: '#f59e0b15', color: 'warning.main' }}>
                      <Speed sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography variant="body2" color="textSecondary" fontWeight={600} gutterBottom>
                      R&D Team Size
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: 'warning.main', mt: 1 }}>
                      {teamPerformance?.rndTeam?.length || 0}
                    </Typography>
                    <Chip 
                      label="Active members" 
                      size="small" 
                      sx={{ mt: 2, backgroundColor: '#f59e0b15', color: 'warning.main', fontWeight: 600 }}
                    />
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
