import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Box } from '@mui/material'
import { validatePlayerTag, registerUser } from '../services/api'

function RegisterForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [playerTag, setPlayerTag] = useState('')
    const [isTagValid, setIsTagValid] = useState(false)
    const [tagChecked, setTagChecked] = useState(false)

    useEffect(() => {
        if (playerTag.length === 8) {
            validatePlayerTag(playerTag)
                .then((response) => {
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
            })
            .catch((error) => {
                console.error("Error registering user: ", error);
            });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Create Account
            </Typography>
            <TextField
                label="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                fullWidth
                margin="normal"
                required
            />
            <TextField
                label="player tag (e.g., UVOQYUUP)"
                value={playerTag}
                onChange={(event) => setPlayerTag(event.target.value)}
                fullWidth
                margin="normal"
                required
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
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isTagValid || !username || !password}
                sx={{ mt: 2 }}
            >
                Create Account
            </Button>
        </Box>
    );
}

export default RegisterForm;