// Strategy Design pattern
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { AuthStrategy } from './AuthStrategy'; //interface to be used by authmethods
export class GoogleAuth implements AuthStrategy {
  async authenticate(): Promise<void> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider); }}
