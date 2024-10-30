// Strategy Design Pattern
export interface AuthStrategy { //interface to be used by authmethods
    authenticate(email?: string, password?: string): Promise<void>;}