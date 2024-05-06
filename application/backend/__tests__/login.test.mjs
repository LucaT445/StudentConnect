import { authenticate } from './authService.mjs';
import { getSession } from './sessionService.mjs';
import { getUserProfile } from './userService.mjs';
describe('Login Integration Tests', () => {
    test('Successful login creates a session and allows user profile access', async () => {
      const username = 'validUser';
      const password = 'validPass';
      const isAuthenticated = await authenticate(username, password);
      expect(isAuthenticated).toBeTruthy();
  
      const session = await getSession(username);  
      expect(session).toBeDefined();
      expect(session.username).toEqual(username);
  
      const profile = await getUserProfile(username);  
      expect(profile.username).toEqual(username);
    });
  });
  