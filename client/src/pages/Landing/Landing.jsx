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
  IconButton,
  useTheme,
  alpha
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as ReportIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  BusinessCenter as BusinessIcon,
  Insights as InsightsIcon,
  AutoAwesome as SparkleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudQueue as CloudIcon,
  ArrowForward as ArrowForwardIcon,
  PlayArrow as PlayIcon,
  AutoGraph as AutoGraphIcon,
  Bolt as BoltIcon
} from '@mui/icons-material';
import useAuthStore from '../../store/authStore';

const Landing = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuthStore();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <AutoGraphIcon sx={{ fontSize: 32 }} />,
      title: 'Intelligent Analytics',
      description: 'AI-powered insights and predictions to help you make data-driven decisions faster',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 32 }} />,
      title: 'Real-time Dashboard',
      description: 'Beautiful, intuitive dashboard with live updates and customizable widgets',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: <BoltIcon sx={{ fontSize: 32 }} />,
      title: 'Lightning Fast',
      description: 'Optimized performance ensures instant loading and seamless interactions',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 32 }} />,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance with industry-leading security standards',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
      title: 'Team Collaboration',
      description: 'Seamless collaboration tools to keep your entire team in sync',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: <CloudIcon sx={{ fontSize: 32 }} />,
      title: 'Cloud Native',
      description: 'Access your data anywhere, anytime with our cloud-based infrastructure',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    }
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime', sublabel: 'Guaranteed' },
    { number: '10K+', label: 'Active Users', sublabel: 'Worldwide' },
    { number: '<100ms', label: 'Response Time', sublabel: 'Average' },
    { number: '24/7', label: 'Support', sublabel: 'Available' }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated gradient orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: { xs: 300, md: 600 },
          height: { xs: 300, md: 600 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'float 20s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5%',
          left: '5%',
          width: { xs: 400, md: 700 },
          height: { xs: 400, md: 700 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 85, 108, 0.12) 0%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'float 25s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: 250, md: 500 },
          height: { xs: 250, md: 500 },
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'float 30s ease-in-out infinite',
          pointerEvents: 'none'
        }}
      />

      {/* Grain texture overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          opacity: 0.02,
          pointerEvents: 'none'
        }}
      />

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(40px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.5); }
            50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.8), 0 0 60px rgba(102, 126, 234, 0.4); }
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
            pt: { xs: 16, md: 12 },
            pb: 8
          }}
        >
          {/* Top Badge */}
          <Box 
            sx={{ 
              textAlign: 'center', 
              mb: 4,
              animation: 'fadeInUp 0.8s ease-out'
            }}
          >
            <Chip
              icon={<SparkleIcon sx={{ fontSize: 18 }} />}
              label="Introducing Sales Enquiry Management 2.0"
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                fontWeight: 600,
                px: 2,
                py: 3,
                fontSize: '0.875rem',
                '& .MuiChip-icon': {
                  color: '#667eea'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                }
              }}
            />
          </Box>

          {/* Main Headline */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem', lg: '6rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 3,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                animation: 'fadeInUp 1s ease-out'
              }}
            >
              Sales intelligence
              <br />
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f5576c 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                reimagined
              </Box>
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                color: '#64748b',
                fontWeight: 400,
                maxWidth: 700,
                mx: 'auto',
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.5rem' },
                lineHeight: 1.6,
                animation: 'fadeInUp 1.2s ease-out'
              }}
            >
              Transform your sales workflow with AI-powered insights.
              Built for modern teams who demand excellence.
            </Typography>

            {/* CTA Buttons */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 6, animation: 'fadeInUp 1.4s ease-out' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={handleGetStarted}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  textTransform: 'none',
                  boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c8ef0 0%, #8659ae 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 15px 50px rgba(102, 126, 234, 0.5)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {isAuthenticated ? 'Open Dashboard' : 'Start for free'}
              </Button>
              
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PlayIcon />}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#667eea',
                    borderColor: '#667eea',
                    borderRadius: '12px',
                    borderWidth: 2,
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#764ba2',
                      borderWidth: 2,
                      background: 'rgba(102, 126, 234, 0.05)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Watch demo
                </Button>
              )}
            </Stack>

            {/* Social Proof */}
            <Typography
              variant="body2"
              sx={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                animation: 'fadeInUp 1.6s ease-out'
              }}
            >
              Trusted by 10,000+ sales teams worldwide
            </Typography>
          </Box>

          {/* Stats Grid */}
          <Grid 
            container 
            spacing={2} 
            sx={{ 
              mb: 12,
              mt: 8,
              animation: 'fadeInUp 1.8s ease-out'
            }}
          >
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid rgba(102, 126, 234, 0.3)',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.15)',
                    }
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      fontWeight: 800,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      mb: 0.5
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#94a3b8',
                      fontSize: '0.75rem'
                    }}
                  >
                    {stat.sublabel}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Features Section */}
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="overline"
              sx={{
                color: '#667eea',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                mb: 2,
                display: 'block'
              }}
            >
              FEATURES
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#0f172a',
                mb: 2,
                lineHeight: 1.2
              }}
            >
              Everything you need.
              <br />
              Nothing you don't.
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                fontSize: '1.1rem'
              }}
            >
              Powerful features designed to streamline your sales workflow
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={3} sx={{ mb: 12 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(102, 126, 234, 0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: feature.gradient,
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 1)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
                      '&::before': {
                        opacity: 1
                      },
                      '& .feature-icon': {
                        background: feature.gradient,
                        transform: 'scale(1.1)'
                      }
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      className="feature-icon"
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '14px',
                        background: 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                        color: '#667eea',
                        transition: 'all 0.4s ease'
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#0f172a',
                        mb: 1.5,
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

          {/* Final CTA */}
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 6, md: 10 },
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.15)',
              borderRadius: '24px',
              boxShadow: '0 8px 40px rgba(102, 126, 234, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              mt: 8
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '150%',
                height: '150%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
                animation: 'glow 4s ease-in-out infinite',
                pointerEvents: 'none'
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem' },
                fontWeight: 800,
                color: '#0f172a',
                mb: 2,
                position: 'relative',
                zIndex: 1
              }}
            >
              Ready to get started?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#64748b',
                mb: 4,
                fontWeight: 400,
                position: 'relative',
                zIndex: 1,
                fontSize: '1.1rem'
              }}
            >
              Join thousands of teams already using our platform
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
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '14px',
                textTransform: 'none',
                boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
                position: 'relative',
                zIndex: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #7c8ef0 0%, #8659ae 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 20px 50px rgba(102, 126, 234, 0.5)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Start free trial'}
            </Button>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: '#94a3b8',
                mt: 3,
                position: 'relative',
                zIndex: 1,
                fontSize: '0.875rem'
              }}
            >
              No credit card required · 14-day free trial · Cancel anytime
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
