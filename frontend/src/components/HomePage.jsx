import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Placeholder for logout logic
        navigate('/signup');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                bgcolor: 'grey.100',
                p: 4
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom>
                Welcome to your Clash of Clans Dashboard!
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
                You've successfully registered and logged in.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                sx={{ mt: 3 }}
            >
                Logout
            </Button>
        </Box>
    );
}

export default HomePage;