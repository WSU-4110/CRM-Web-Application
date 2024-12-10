export const initializeApp = jest.fn(() => ({
    name: '[DEFAULT]',
    options: {},
  }));
  
  export const getAuth = jest.fn(() => ({
    currentUser: null,
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  }));
  
  export const getFirestore = jest.fn(() => ({
    collection: jest.fn(),
    doc: jest.fn(),
  }));
  
  export const getStorage = jest.fn(() => ({
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn(),
  }));