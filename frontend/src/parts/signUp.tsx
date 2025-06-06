/**
 * SignUpForm Component
 * 
 * This component allows users to sign up by entering their name, email, and password.
 * It calls the `signUp` function from the `useAuth` hook to handle the registration process.
 * 
 * - Handles form submission and error states.
 * - Displays loading state during the sign-up process.
 * - Sets the logged-in user on successful sign-up.
 * - Handles error messages on sign-up failure.
 * 
 *  Props: `setLoggedInUser`: A function to set the logged-in user data in the parent component.
 */


import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function SignUpForm({
  setLoggedInUser,
}: {
  setLoggedInUser: (user: { email: string; image: string }) => void;
}) {
  const { signUp } = useAuth();

  // State to manage the form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Added error state to hold error message

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state before attempting sign-up

    try {
      const errorMessage = await signUp(email, password, name); // Call signUp and capture any error message

      if (errorMessage) {
        setError(errorMessage); // Set the error message if there's an error
      } else {
        // If no error, set the logged-in user
        setLoggedInUser({
          email,
          image:
            "https://moviesitebucket.nyc3.cdn.digitaloceanspaces.com/Sample_User_Icon.png", //default image
        });
      }
    } catch (err) {
      console.error("Sign up error:", err);
      setError("An error occurred. Please try again."); // Set error message in case of an unexpected error
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Example Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
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
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message if present */}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
