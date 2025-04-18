import { useState } from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  setLoggedInUser: (user: { email: string; image?: string }) => void;
  setShowSignUp: (show: boolean) => void;
};

export default function LoginForm({ setLoggedInUser, setShowSignUp }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async () => {
    setError(null); // Clear any previous error message
    try {
      const result = await login(email, password);

      if (result) {
        setLoggedInUser({ email });
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="space-y-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>Enter your email and password</CardDescription>
      </CardHeader>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" className="w-full" onClick={handleSubmit}>
        Login
      </Button>

      <div className="flex items-center justify-center space-x-2">
        <span>Don't have an account?</span>
        <button
          className="text-blue-500 p-0"
          onClick={() => setShowSignUp(true)} // Show the signup form when clicked
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
