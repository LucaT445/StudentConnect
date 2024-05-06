
import { registerUser, authenticateUser, changePassword } from './userService.mjs';

describe('Password Update and Login Tests', () => {
  let username = 'testUser';

  // Creates user for testing
  beforeAll(async () => {
    await registerUser({ username: username, password: 'initialPassword123' });
  });

  test('Password Change Success Path', async () => {
    // Changes the password
    const changeResult = await changePassword(username, 'newPassword123');
    expect(changeResult.success).toBeTruthy();

    // This attempts to log in with the new password
    const loginResultNew = await authenticateUser(username, 'newPassword123');
    expect(loginResultNew.success).toBeTruthy();

    // This attempts to log in with the old password
    const loginResultOld = await authenticateUser(username, 'initialPassword123');
    expect(loginResultOld.success).toBeFalsy();
  });

  test('Password Change Validation', async () => {
    // This attempts to change to a weak password
    const weakPasswordResult = await changePassword(username, 'short');
    expect(weakPasswordResult.success).toBeFalsy();

    // Ensure the old password still works
    const loginResult = await authenticateUser(username, 'newPassword123'); // This assumes previous successful password change
    expect(loginResult.success).toBeTruthy();
  });
});
