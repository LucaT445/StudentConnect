import { authenticate } from './authService.mjs';

describe('Authentication Unit Tests', () => {
  test('User login with correct credentials', async () => {
    const username = 'testuser';
    const password = 'testpass';

    // Direct call to authenticate
    const result = await authenticate(username, password);
    expect(result).toBe(true); // Expect true because credentials are correct
  });

  test('User login with incorrect credentials', async () => {
    const username = 'testuser';
    const password = 'wrongpass';

 
    const result = await authenticate(username, password);
    expect(result).toBe(false); // Expect false because password is incorrect
  });
});
