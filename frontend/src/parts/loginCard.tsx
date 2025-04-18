import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/parts/loginForm"; // to login
import SignUpForm from "@/parts/signUp"; // to sign up
import LoggedInCard from "@/parts/loggedInCard"; // after login

export default function LoginCard() {

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
    <div style={{ position: "absolute", top: 40, left: 40, zIndex: 1000 }}>
      <Card className="mx-auto w-[360px] shadow-xl">
        <CardContent>
          {loggedInUser ? (
            <LoggedInCard
              setLoggedInUser={setLoggedInUser}
              setShowSignUp={setShowSignUp}
            />
          ) : showSignUp ? (
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
