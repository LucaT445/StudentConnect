
const authService = require('./authService');

const users = [
    { username: 'testuser', password: 'testpass' },
    { username: 'validUser', password: 'validPass' }  
];

export const authenticate = async (username, password) => {
    console.log("Authenticating:", username, password); // Log credentials to verify input
    const user = users.find(user => user.username === username);
    console.log("User found:", user); // Log found user to see if match is correct
    if (!user) return false; // User not found
    return user.password === password; // Validate password
};


