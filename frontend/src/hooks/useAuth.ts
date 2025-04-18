import { useState, useEffect } from "react";
import { createAuthClient } from "better-auth/client";
import { log } from "console";

// Define the shape of a user object
export type User = {
  email: string;
  image?: string;
};

const authClient = createAuthClient({
  baseURL: "http://localhost:5050", // The base URL of your auth server
});

// The hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // logged-in user
  const [error, setError] = useState(""); // error message if login fails

  // Automatically restore user session from localStorage
  useEffect(() => {
    const email = localStorage.getItem("email");
    const image = localStorage.getItem("image");
    if (email && image) {
      setUser({ email, image });
    }
  }, []);

  // Handles login API request
  const login = async (email: string, password: string) => {

    try {
      const result = await authClient.signIn.email({ email, password });
      const session = await authClient.getSession();
      console.log("Session:", session);
      console.log("Result:", result);
      if (!result.error) {
        const userImage = result.data?.user?.image || "https://github.com/shadcn.png";
        localStorage.setItem("email", email);
        localStorage.setItem("image", userImage);
        setUser({ email, image: userImage });
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      return false;
    } 
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email({ email, password, name });
      console.log("Sign up result:", result);

      if (!result.error) {
        // After successful signup, login the user
        const userImage =
          result.data?.user?.image || "https://github.com/shadcn.png";
        localStorage.setItem("email", email);
        localStorage.setItem("image", userImage);
        setUser({ email, image: userImage });
        return true;
      } else {
        setError("Sign up failed. Please check your credentials.");
        return false;
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during sign up.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      localStorage.removeItem("email");
      localStorage.removeItem("image");
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
    
  }

  const uploadAndSetProfileImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5050/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.url;

      await authClient.updateUser({image: imageUrl}); //uopdate it in the client database 
      localStorage.setItem("image", imageUrl); //upadte the local storage
      setUser((prev) => (prev ? { ...prev, image: imageUrl } : null));   //update the user object

    } catch (err) {
      console.error("Image upload or update failed:", err);
    }
  };

  return {
    user,
    signUp,
    login,
    logout,
    uploadAndSetProfileImage,
  };
}
