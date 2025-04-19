/**
 * This file contains a custom React hook for managing authentication and user profile data using the `better-auth` client.
 * The `useAuth` hook provides functions to sign in, sign up, sign out, and update the user's profile image. It also handles session management by saving user data to `localStorage` so that the user remains logged in even after a page reload.
 * 
 * The following functionality is provided:
 * 1. `signIn`: Handles user login, stores user data in `localStorage`, and updates the user state on success.
 * 2. `signUp`: Handles user sign-up, stores user data in `localStorage`, and updates the user state on success.
 * 3. `signOut`: Signs the user out, removes user data from `localStorage`, and clears the user state.
 * 4. `setProfileImage`: Uploads a profile image to cloud storage, updates the user's profile in the `better-auth` client, and stores the updated image URL in `localStorage` and the user state.
 ***/


import { useState, useEffect } from "react";
import { createAuthClient } from "better-auth/client";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Define the shape of a user object
export type User = {
  email: string;
  image?: string;
};

// Create the better auth client instance with the backend URL
const authClient = createAuthClient({
  baseURL: BACKEND_URL, // The base URL of your auth server
});

// The hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null); // logged-in user state
  const [error] = useState(""); // error message state

  // Automatically restore user session from localStorage, so on reaload the user is not logged out
  useEffect(() => {
    const email = localStorage.getItem("email");
    const image = localStorage.getItem("image");
    if (email && image) {
      setUser({ email, image });
    }
  }, []);

  // Handles login request and updates user state upon success
  const signIn = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    try {
      const result = await authClient.signIn.email({ email, password });

      if (!result.error) {
        const userImage = result.data?.user?.image || " ";
        localStorage.setItem("email", email); // Store email in localStorage
        localStorage.setItem("image", userImage); // Store image in localStorage
        setUser({ email, image: userImage }); // Set user state
        return null; // No error, login succeeded
      } else {
        return (
          result.error.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error(err);
      return err instanceof Error
        ? err.message
        : String(err) || "Login failed. Please check your credentials.";
    }
  };

  // Handles sign-up request and stores user data upon success
  const signUp = async (
    email: string,
    password: string,
    name: string
  ): Promise<string | null> => {
    try {
      const result = await authClient.signUp.email({ email, password, name });

      if (!result.error) {
        const userImage =
          result.data?.user?.image ||
          "https://moviesitebucket.nyc3.cdn.digitaloceanspaces.com/Sample_User_Icon.png";
        localStorage.setItem("email", email); // Store email in localStorage
        localStorage.setItem("image", userImage); // Store image in localStorage
        setUser({ email, image: userImage });
        return null; // No error, sign up succeeded
      } else {
        return (
          result.error.message ||
          "Sign up failed. Please check your credentials."
        );
      }
    } catch (err) {
      console.error(err);
      return err instanceof Error
        ? err.message
        : String(err) || "An error occurred during sign up.";
    }
  };

  // Handles sign-out and removes user data from localStorage
  const signOut = async () => {
    try {
      await authClient.signOut(); //sign out in better-atuh
      localStorage.removeItem("email"); //remove items from local storage
      localStorage.removeItem("image");
      setUser(null); //make the user null
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Handle uploading image to cloud storage and image update in better-auth database
  const setProfileImage = async (file: File) => {
    try {
      const formData = new FormData(); // Create a new FormData object
      formData.append("file", file); // Append the file to the FormData object

      const res = await fetch(`${BACKEND_URL}/api/cloud_storage`, {
        //upload the image to digital ocean
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const imageUrl = data.url; //get the url of the image uploaded to digital ocean

      await authClient.updateUser({ image: imageUrl }); //uopdate it in the better-auth client database
      localStorage.setItem("image", imageUrl); //upadte the local storage
      setUser((prev) => (prev ? { ...prev, image: imageUrl } : null)); //update the user object
    } catch (err) {
      console.error("Image upload or update failed:", err);
    }
  };

  // Return authentication functions and states
  return {
    user,
    error,
    signUp,
    signIn,
    signOut,
    setProfileImage,
  };
}
