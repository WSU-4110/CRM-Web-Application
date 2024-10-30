'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailPasswordAuth } from '../strategies/EmailPasswordAuth';
import { GoogleAuth } from '../strategies/GoogleAuth';
import { AuthStrategy } from '../strategies/AuthStrategy';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authStrategy, setAuthStrategy] = useState<AuthStrategy>(new EmailPasswordAuth());
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // This handles authentication with email and password implementation strategy
      await authStrategy.authenticate(email, password);
      router.push('/dashboard');
    } catch (error) {
      setError('Error, could not login with email and password. Please try again.');
      setIsLoading(false);}};
  // Separate function for Google sign-in implementation strategy
  const signinWithGoogle = async () => {
    setAuthStrategy(new GoogleAuth());
    setError('');
    setIsLoading(true);
    try {
      await authStrategy.authenticate();
      router.push('/dashboard');
    } catch (error) {
      setError('Error, could not login with Google authentication. Please try again.');
      setIsLoading(false);}};
  return ( /* basic tailwind setup to show login form, is not as detailed or nice to look at
     as actual project but gets the job done */
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}/> 
          <Input
          id="password"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}/>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>)}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full">  {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={signinWithGoogle}
            disabled={isLoading}
            className="w-full">
            Sign in with Google
          </Button>
        </div>
      </form>
    </div>);};
export default Login;
