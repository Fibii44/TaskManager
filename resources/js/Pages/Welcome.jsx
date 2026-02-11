import { Link, Head } from '@inertiajs/react';
import { Box, Button, Typography, Container, Stack, Paper } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function Welcome({ auth }) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#fff5f7', display: 'flex', flexDirection: 'column' }}>
            <Head title="Welcome to Manager" />

            {/* Navigation Bar */}
            <Box component="nav" sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                {auth.user ? (
                    <Button 
                        component={Link} 
                        href={route('dashboard')} 
                        startIcon={<DashboardIcon />}
                        sx={{ color: '#be185d', fontWeight: 'bold' }}
                    >
                        Go to Dashboard
                    </Button>
                ) : (
                    <>
                        <Button 
                            component={Link} 
                            href={route('login')} 
                            sx={{ color: '#64748b', fontWeight: 'bold' }}
                        >
                            Log in
                        </Button>
                        <Button 
                            component={Link} 
                            href={route('register')} 
                            variant="outlined"
                            sx={{ color: '#be185d', borderColor: '#be185d', borderRadius: '12px', fontWeight: 'bold', '&:hover': { borderColor: '#9d174d', bgcolor: '#fdf2f8' } }}
                        >
                            Register
                        </Button>
                    </>
                )}
            </Box>

            {/* Hero Section */}
            <Container maxWidth="md" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Box 
                        sx={{ 
                            display: 'inline-flex', 
                            p: 2, 
                            bgcolor: '#fce7f3', 
                            color: '#be185d', 
                            borderRadius: '24px', 
                            mb: 3,
                            animation: 'bounce 2s infinite'
                        }}
                    >
                        <RocketLaunchIcon sx={{ fontSize: 40 }} />
                    </Box>
                    
                    <Typography variant="h2" sx={{ fontWeight: 900, color: '#1e293b', mb: 2, letterSpacing: '-0.02em' }}>
                        Manage Tasks <br />
                        <span style={{ color: '#be185d' }}>With Precision.</span>
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: '#64748b', mb: 5, fontWeight: 'medium', maxWidth: '600px', mx: 'auto' }}>
                        The ultimate Admin Command Center for modern teams. 
                        Dispatch, track, and complete assignments in one beautiful interface.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        {!auth.user ? (
                            <>
                                <Button 
                                    component={Link} 
                                    href={route('register')} 
                                    variant="contained" 
                                    size="large"
                                    startIcon={<PersonAddIcon />}
                                    sx={{ bgcolor: '#be185d', px: 4, py: 1.5, borderRadius: '16px', fontWeight: 'bold', fontSize: '1.1rem', '&:hover': { bgcolor: '#9d174d' } }}
                                >
                                    Get Started
                                </Button>
                                <Button 
                                    component={Link} 
                                    href={route('login')} 
                                    variant="text" 
                                    size="large"
                                    startIcon={<LoginIcon />}
                                    sx={{ color: '#1e293b', px: 4, py: 1.5, fontWeight: 'bold' }}
                                >
                                    Login to Account
                                </Button>
                            </>
                        ) : (
                            <Button 
                                component={Link} 
                                href={route('dashboard')} 
                                variant="contained" 
                                size="large"
                                sx={{ bgcolor: '#be185d', px: 6, py: 2, borderRadius: '16px', fontWeight: 'bold' }}
                            >
                                Back to Command Center
                            </Button>
                        )}
                    </Stack>
                </Box>
            </Container>

            {/* Simple Footer */}
            <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Powered by Laravel & React
                </Typography>
            </Box>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </Box>
    );
}