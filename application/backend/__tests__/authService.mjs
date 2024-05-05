// Assuming you have a function 'authenticate' in 'authService.mjs'
const authService = require('./authService');

const users = [
    { username: 'testuser', password: 'testpass' } // Example user
];

export const authenticate = async (username, password) => {
    const user = users.find(user => user.username === username);
    if (!user) return false; // User not found
    return user.password === password; // Validate password
};


