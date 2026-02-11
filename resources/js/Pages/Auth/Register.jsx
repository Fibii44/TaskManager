import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    TextField, 
    Button, 
    Box, 
    Typography, 
    Paper, 
    Divider, 
    InputAdornment 
} from '@mui/material';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Create Account" />

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box 
                        sx={{ 
                            width: 56, 
                            height: 56, 
                            bgcolor: '#fce7f3', 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            color: '#be185d'
                        }}
                    >
                        <PersonAddOutlinedIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Join the Team
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Create your account to start managing tasks
                    </Typography>
                </Box>

                <form onSubmit={submit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                            label="Full Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                            autoComplete="name"
                            autoFocus
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Email Address"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            autoComplete="username"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            autoComplete="new-password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            variant="outlined"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            error={!!errors.password_confirmation}
                            helperText={errors.password_confirmation}
                            autoComplete="new-password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={processing}
                            sx={{
                                mt: 1,
                                py: 1.5,
                                borderRadius: 3,
                                bgcolor: '#be185d',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': { bgcolor: '#9d174d' },
                                boxShadow: '0 4px 12px rgba(190, 24, 93, 0.2)'
                            }}
                        >
                            Create Account
                        </Button>

                        <Box sx={{ textAlign: 'center', mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-pink-600 hover:text-pink-800 transition underline"
                                >
                                    Log in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </form>

                <Divider sx={{ my: 4 }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', textTransform: 'uppercase' }}>
                        Manager v1.0
                    </Typography>
                </Divider>
            </Paper>
        </GuestLayout>
    );
}