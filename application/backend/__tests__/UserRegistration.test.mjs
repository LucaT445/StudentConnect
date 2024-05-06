import { registerUser, authenticateUser } from './userService.mjs'; 

describe('User Registration and Login Integration Tests', () => {
  test('User can register and then log in successfully', async () => {
    const userInfo = {
      username: 'newuser',
      password: 'newpassword123',
      email: 'newuser@example.com'
    };

    // Register user
    const registrationResult = await registerUser(userInfo);
    expect(registrationResult.success).toBeTruthy();

    // Login with the same credentials
    const loginResult = await authenticateUser(userInfo.username, userInfo.password);
    expect(loginResult.success).toBeTruthy();
    expect(loginResult.user).toBeDefined();
  });
});