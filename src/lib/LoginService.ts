import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// got a little help from group regarding param and promise usage
export class LoginService {
  private auth = getAuth();
  /**
   * Signs in a user with email and password.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns {Promise<any>} - Returns a promise that resolves to the user object or throws an error.
   */
  async loginWithEmailAndPassword(email: string, password: string): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user; // Returns the authenticated user object
    } catch (error) {
      throw new Error('Failed to log in with email and password');
    }
  }
  /**
   * Signs in a user with Google OAuth.
   * @returns {Promise<any>} - Returns a promise that resolves to the user object or throws an error.
   */
  async loginWithGoogle(): Promise<any> {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(this.auth, provider);
      return userCredential.user; // Returns the authenticated user object
    } catch (error) {
      throw new Error('Failed to log in with Google');
    }
  }
  /**
   * Signs out the current user.
   * @returns {Promise<void>} - Returns a promise indicating the result of the sign-out operation.
   */
  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      throw new Error('Failed to log out');
    }
  }
}