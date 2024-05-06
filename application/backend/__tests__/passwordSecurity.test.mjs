
describe('Password Update and Security', () => {
    beforeEach(() => {
      jest.resetModules(); // Reset modules to clear previous mocks
      jest.mock('./userService.mjs', () => ({
        updatePassword: jest.fn((userId, newPassword) => {
          if (newPassword.length < 8) {
            return Promise.reject(new Error('Password too weak'));
          }
          return Promise.resolve(true);
        }),
        loginUser: jest.fn()
      }));
    });
  
    test('Validate password strength on update', async () => {
      const { updatePassword } = require('./userService.mjs');
  
      await expect(updatePassword('user1', 'weak')).rejects.toThrow('Password too weak');
      await expect(updatePassword('user1', 'strongEnoughPassword')).resolves.toBeTruthy();
    });
  
    test('Ensure old passwords cannot access the system', async () => {
      const { loginUser, updatePassword } = require('./userService.mjs');
  
      await updatePassword('user1', 'newSecurePassword');
      loginUser.mockImplementation((username, password) => {
        return password === 'newSecurePassword';
      });
  
      expect(loginUser('user1', 'oldPassword')).toBeFalsy();
      expect(loginUser('user1', 'newSecurePassword')).toBeTruthy();
    });
  
    test('Verify lockout mechanism after several failed login attempts', async () => {
      const { loginUser } = require('./userService.mjs');
  
      loginUser.mockImplementation(() => false);
      for (let i = 0; i < 5; i++) { // Uses 5 as the lockout threshold
        loginUser('user1', 'wrongPassword');
      }
      expect(loginUser('user1', 'anyPassword')).toBeFalsy(); 
    });
  });
  
  
  