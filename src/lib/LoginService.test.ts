import { LoginService } from './LoginService';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// firebase
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(),
}));
// Ammar Ahmed HL5101
describe('LoginService', () => {
  let loginService: LoginService;
  let mockAuth: any;
  
  beforeEach(() => {
    // mock auth
    mockAuth = { currentUser: null };
    (getAuth as jest.Mock).mockReturnValue(mockAuth);
    loginService = new LoginService();
  });
  describe('loginWithEmailAndPassword', () => {
    it('in with email and password', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({ user: mockUser });
      const result = await loginService.loginWithEmailAndPassword('test@example.com', 'password123');
      
      expect(result).toEqual(mockUser);
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'test@example.com', 'password123');
    });
    it('should throw an error when login fails', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Failed to log in with email and password'));
      await expect(loginService.loginWithEmailAndPassword('test@example.com', 'wrongpassword'))
        .rejects
        .toThrow('Failed to log in with email and password');
    });
  });
  describe('loginWithGoogle', () => {
    it('should successfully login with Google', async () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      (signInWithPopup as jest.Mock).mockResolvedValue({ user: mockUser });
      const result = await loginService.loginWithGoogle();
      
      expect(result).toEqual(mockUser);
      expect(signInWithPopup).toHaveBeenCalledWith(mockAuth, expect.any(GoogleAuthProvider));
    });
    it('should throw an error when Google login fails', async () => {
      (signInWithPopup as jest.Mock).mockRejectedValue(new Error('Failed to log in with Google'));
      await expect(loginService.loginWithGoogle())
        .rejects
        .toThrow('Failed to log in with Google');
    });
  });
});