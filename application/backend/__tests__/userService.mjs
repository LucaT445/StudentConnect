const userProfiles = { 'validUser': { username: 'validUser', profile: 'Profile Information' } };
const users = {};

export const registerUser = async (userInfo) => {
  if (users[userInfo.username]) {
    return { success: false, message: "User already exists" };
  }
  users[userInfo.username] = { ...userInfo, profile: "New User Profile" };
  return { success: true, message: "User registered successfully" };
};

export const authenticateUser = async (username, password) => {
  if (users[username] && users[username].password === password) {
    return { success: true, user: users[username] };
  }
  return { success: false, message: "Invalid username or password" };
};

export const getUserProfile = async (username) => {
  return userProfiles[username] || null;
};

export const changePassword = async (username, newPassword) => {
  if (users[username] && newPassword.length >= 8) {  
    users[username].password = newPassword;  // Changes the password
    return { success: true, message: "Password updated successfully" };
  }
  return { success: false, message: "Password update failed. Ensure your new password meets the criteria." };
};
