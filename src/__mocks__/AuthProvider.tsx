import React from 'react'
const mockAuthContext = {
  user: null,
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
}
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}