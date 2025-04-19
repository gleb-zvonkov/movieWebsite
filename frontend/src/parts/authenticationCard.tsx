/**
 * authenticationCard.tsx
 *
 * Manages user authentication by toggling between login, sign-up, and user info display.
 * - Loads user data from localStorage on initial load and stores it on state changes.
 * - Displays the `UserInfoCard` when a user is logged in.
 * - Displays `SignUpForm` if `showSignUp` is true, otherwise shows `LoginForm`.
 *
 * Components used:
 * - `LoginForm`: For user login.
 * - `SignUpForm`: For new user registration.
 * - `LoggedInCard`: For showing user info after login.
 */

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/parts/signIn"; // to login
import SignUpForm from "@/parts/signUp"; // to sign up
import UserInfoCard from "@/parts/userInfo"; // after login

export default function authenticationCard() {
  const [loggedInUser, setLoggedInUser] = useState<{
    email: string;
    image?: string;
  } | null>(null);

  const [showSignUp, setShowSignUp] = useState(false); // State to toggle between login and sign up

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser"); // If there is already a user in local storage
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

  // Save loggedInUser to localStorage whenever it changes
  useEffect(() => {
    if (loggedInUser) {
      localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
    }
  }, [loggedInUser]);

  return (
    <div style={{ position: "absolute", top: 50, left: 50, zIndex: 1000 }}>
      <Card className="mx-auto w-[360px] shadow-xl">
        <CardContent>
          {loggedInUser ? ( //   if logged in, show user info
            <UserInfoCard
              setLoggedInUser={setLoggedInUser}
              setShowSignUp={setShowSignUp}
            />
          ) : showSignUp ? ( // if button to sign up is pressed, show sign up form
            <SignUpForm setLoggedInUser={setLoggedInUser} />
          ) : (
            <LoginForm
              setShowSignUp={setShowSignUp}
              setLoggedInUser={setLoggedInUser}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
