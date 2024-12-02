import '@testing-library/jest-dom'

// Mock window.fetch
global.fetch = jest.fn();

// Mock Firebase
jest.mock('firebase/app');
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');