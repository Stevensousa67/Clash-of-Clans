import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box, Card, Divider, CssBaseline, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { validatePlayerTag, registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [playerTag, setPlayerTag] = useState('');
    const [isTagValid, setIsTagValid] = useState(false);
    const [tagChecked, setTagChecked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (playerTag.length === 8) {
            validatePlayerTag(playerTag)
                .then((response) => {
                    console.log('Validation response:', response.data);
                    setIsTagValid(response.data.valid);
                    setTagChecked(true);
                })
                .catch((error) => {
                    console.error("Error validating Player Tag: ", error);
                    setIsTagValid(false);
                    setTagChecked(true);
                });
        } else {
            setIsTagValid(false);
            setTagChecked(false);
        }
    }, [playerTag]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isTagValid) return;

        const data = {
            username,
            password,
            player_profile: { player_tag: playerTag },
        };

        registerUser(data)
            .then((response) => {
                console.log("Registration successful: ", response);
                navigate('/')
            })
            .catch((error) => {
                console.error("Error registering user: ", error.response?.data || error.message);
            });
    };

    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'grey.100',
                }}
            >
                <Card variant="outlined" sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <LockOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    </Box>
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ textAlign: 'center', mb: 3, fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign Up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            autoComplete="username"
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            required
                            fullWidth
                            variant="outlined"
                        />
                        <TextField
                            label="Player Tag (e.g., UVOQYUUP)"
                            value={playerTag}
                            onChange={(event) => setPlayerTag(event.target.value.toUpperCase())}
                            required
                            fullWidth
                            variant="outlined"
                            helperText={
                                tagChecked
                                    ? isTagValid
                                        ? 'Valid player tag!'
                                        : 'Invalid player tag.'
                                    : 'Enter 8 characters without the # symbol.'
                            }
                            error={tagChecked && !isTagValid}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!isTagValid || !username || !password}
                            sx={{ mt: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Divider>or</Divider>
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <Link href="#" variant="body2">
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </Box>
        </>
    );
}

export default RegisterForm;