import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, CircularProgress, Alert } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Show loading indicator
        setError('');  // Clear previous error message

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                f_userName: username,
                f_Pwd: password
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('f_userName',response.data.f_username); // Save username for Dashboard greeting
            navigate('/dashboard');
        } catch (error) {
            setError('Invalid login details');
        } finally {
            setLoading(false);  // Hide loading indicator
        }
    };

    return (

        <Container maxWidth="lg">
        <Box display="flex" justifyContent="flex-start" mt={2}>
        <img src='Logo_TV_2015.png' alt="Logo" style={{ height: 40 }} />
        </Box>   
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    mt: 8, 
                    padding: 4, 
                    boxShadow: 3, 
                    borderRadius: 2 
                }}
            >
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 3, py: 1.5 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Login;
