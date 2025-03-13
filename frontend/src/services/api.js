import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true, // for session auth
});

export const validatePlayerTag = (playerTag) => 
    api.get(`/validate-player-tag/${playerTag}/`);

export const registerUser = (data) =>
    api.post('/register/', data);

export default api;