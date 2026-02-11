import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    TextField, 
    Button, 
    Checkbox, 
    FormControlLabel, 
    Box, 
    Typography, 
    Paper, 
    Divider 
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Box 
                        sx={{ 
                            width: 56, 
                            height: 56, 
                            bgcolor: '#fdf2f8', 
                            borderRadius: '16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 2,
                            color: '#be185d'
                        }}
                    >
                        <LockOutlinedIcon />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        Please enter your details to sign in
                    </Typography>
                </Box>

                {status && (
                    <Box sx={{ mb: 4, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, color: '#166534', fontSize: '0.875rem' }}>
                        {status}
                    </Box>
                )}

                <form onSubmit={submit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
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
                            autoFocus
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
                            autoComplete="current-password"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        sx={{ color: '#f9a8d4', '&.Mui-checked': { color: '#be185d' } }}
                                    />
                                }
                                label={<Typography variant="body2" sx={{ color: '#64748b' }}>Remember me</Typography>}
                            />
                            
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-pink-600 hover:text-pink-800 transition"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </Box>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={processing}
                            sx={{
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
                            Sign In
                        </Button>
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