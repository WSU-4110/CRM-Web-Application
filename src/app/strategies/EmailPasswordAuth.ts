// Strategy Design Pattern
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthStrategy } from './AuthStrategy'; //interface to be used by authmethods
export class EmailPasswordAuth implements AuthStrategy {
  async authenticate(email: string, password: string): Promise<void> {
    const auth = getAuth();
    if (!email || !password) throw new Error("Error, please include an email and password");
    await signInWithEmailAndPassword(auth, email, password); }}
