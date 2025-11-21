import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  Stack,
  Chip,
  Avatar,
  Divider
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  BusinessCenter as BusinessIcon,
  Insights as InsightsIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudQueue as CloudIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // If already authenticated, show different CTA
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      title: 'Real-time Dashboard',
      description: 'Monitor your sales enquiries with live updates and insights',
      color: '#667eea'
    },
    {
      icon: <ReportIcon sx={{ fontSize: 40 }} />,
      title: 'Advanced Reports',
      description: 'Generate comprehensive reports and analytics for better decisions',
      color: '#f59e0b'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Team Management',
      description: 'Manage users and assign enquiries efficiently',
      color: '#10b981'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Track Performance',
      description: 'Monitor conversion rates and sales performance metrics',
      color: '#ef4444'
    },
    {
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      title: 'Enquiry Management',
      description: 'Organize and track all customer enquiries in one place',
      color: '#8b5cf6'
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 40 }} />,
      title: 'Data Insights',
      description: 'Get actionable insights from your sales data',
      color: '#06b6d4'
    }
  ];

  const benefits = [
    { text: 'Easy to use interface', icon: <CheckIcon /> },
    { text: 'Real-time notifications', icon: <CheckIcon /> },
    { text: 'Secure data encryption', icon: <CheckIcon /> },
    { text: 'Export to Excel/PDF', icon: <CheckIcon /> },
    { text: 'Mobile responsive', icon: <CheckIcon /> },
    { text: 'Cloud-based solution', icon: <CheckIcon /> }
  ];

  const stats = [
    { number: '10K+', label: 'Enquiries Managed' },
    { number: '500+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(80px)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(40px)',
          animation: 'float 7s ease-in-out infinite'
        }}
      />

      {/* Add keyframe animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}
      </style>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8
          }}
        >
          {/* Status Badge */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Chip
              icon={<SpeedIcon />}
              label="Trusted by 500+ Sales Teams"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 600,
                px: 2,
                py: 3,
                fontSize: '0.9rem',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                animation: 'fadeInUp 0.6s ease-out'
              }}
            />
          </Box>

          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                color: 'white',
                fontWeight: 900,
                mb: 3,
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                lineHeight: 1.2,
                animation: 'fadeInUp 0.8s ease-out',
                letterSpacing: '-0.02em'
              }}
            >
              Transform Your<br />
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #fff 0%, #f0f0f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Sales Process
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 4,
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                fontWeight: 400,
                lineHeight: 1.6,
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              Streamline enquiries, boost productivity, and drive sales growth with our comprehensive management platform
            </Typography>

            {/* Benefits List */}
            <Grid 
              container 
              spacing={2} 
              justifyContent="center" 
              sx={{ mb: 5, animation: 'fadeInUp 1.2s ease-out' }}
            >
              {benefits.map((benefit, index) => (
                <Grid item key={index}>
                  <Chip
                    icon={benefit.icon}
                    label={benefit.text}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Grid>
              ))}
            </Grid>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mt: 4, animation: 'fadeInUp 1.4s ease-out' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={handleGetStarted}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  backgroundColor: 'white',
                  color: '#667eea',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  fontWeight: 700,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 40px rgba(0,0,0,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    borderWidth: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-3px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Sign Up
                </Button>
              )}
            </Stack>
          </Box>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 8, animation: 'fadeInUp 1.6s ease-out' }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      background: 'rgba(255, 255, 255, 0.15)'
                    }
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' }
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Features Section Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.8rem' }
              }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Powerful features designed to streamline your sales workflow
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={3} sx={{ mb: 10 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        background: feature.color
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${feature.color}, ${feature.color}dd)`,
                      transform: 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.4s ease'
                    },
                    '&:hover::before': {
                      transform: 'scaleX(1)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '16px',
                        background: `${feature.color}15`,
                        color: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        transition: 'all 0.4s ease'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        color: '#1e293b',
                        fontSize: '1.25rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#64748b',
                        lineHeight: 1.7,
                        fontSize: '0.95rem'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Final CTA Section */}
          <Box
            sx={{
              textAlign: 'center',
              p: 8,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                filter: 'blur(40px)'
              }}
            />
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                position: 'relative',
                zIndex: 1
              }}
            >
              Ready to Transform Your Sales?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 4,
                fontWeight: 400,
                position: 'relative',
                zIndex: 1
              }}
            >
              Join hundreds of teams already using our platform
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleGetStarted}
              sx={{
                px: 8,
                py: 2.5,
                fontSize: '1.2rem',
                backgroundColor: 'white',
                color: '#667eea',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                fontWeight: 700,
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start Free Today'}
            </Button>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'rgba(255, 255, 255, 0.8)',
                mt: 2,
                position: 'relative',
                zIndex: 1
              }}
            >
              No credit card required • Get started in minutes
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
