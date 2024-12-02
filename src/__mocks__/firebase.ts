export const initializeApp = jest.fn();
export const getAuth = jest.fn(() => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));
export const getFirestore = jest.fn();
export const getStorage = jest.fn();
