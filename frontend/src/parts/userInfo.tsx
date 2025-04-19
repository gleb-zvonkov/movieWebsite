/**
 * UserInfoCard Component
 *
 * Displays the logged-in user's avatar and email.
 * Allows the user to:
 * - Upload a new profile image via drag-and-drop or file picker.
 * - View their email.
 * - Sign out, which clears the user data and returns to the login form.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function UserInfoCard({
  setLoggedInUser,
  setShowSignUp, // Add this prop to reset the showSignUp state
}: {
  setLoggedInUser: React.Dispatch<React.SetStateAction<any>>; // from the parent setLoggedInUser: Clear the user info on sign out
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>; // from the parent setShowSignUp: reset the sign-up view on sign out.
}) {
  const { user, setProfileImage, signOut } = useAuth(); //use Auth info

  const [uploadedImageUrl, setUploadedImageUrl] = useState(() => {
    return localStorage.getItem("image") || user?.image;
  });
  const [dragActive, setDragActive] = useState(false); //Tracks whether a drag event is active, used to add visual feedback (a ring effect) when a user is dragging a file over the avatar
  const [isUploading, setIsUploading] = useState(false); // State to track upload progress
  const fileInputRef = useRef<HTMLInputElement | null>(null); //A reference to the hidden file input element that is triggered when the avatar is clicked.

  //Handles the process of uploading the user's image.
  const handleUpload = async (file: File) => {
    setIsUploading(true); // Start the uploading process
    try {
      await setProfileImage(file); // Calls the function from the `useAuth` hook to upload the image
      const updatedUrl = localStorage.getItem("image"); //retireves the image url form local storage
      setUploadedImageUrl(updatedUrl || user?.image); // Updates the local state with the new image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false); // End the uploading process
    }
  };

  // Handles the drag-and-drop event for uploading an image
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); // Prevent the default behavior (e.g., opening the file)
    setDragActive(false); // Deactivate the drag active state to remove any drag-specific styles
    const file = e.dataTransfer.files[0]; // Get the dropped file
    if (file?.type.startsWith("image/")) {
      // Check if the dropped file is an image before uploading
      handleUpload(file);
    }
  };

  // Handles file selection through the file input field
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
    if (file?.type.startsWith("image/")) {
      // Check if the selected file is an image before uploading
      handleUpload(file);
    }
  };

  // Triggered when the user clicks on the avatar to select a file
  // opens the file picker dialog so the user can select an image from their system
  const handleAvatarClick = () => {
    fileInputRef.current?.click(); // trigger the hidden file input click to open the file dialog
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Call the logout function from useAuth

      // Reset the logged-in user state
      setLoggedInUser(null); // This will bring back the LoginForm
      setShowSignUp(false); // Reset the sign-up state to show LoginForm

      // clear other localStorage items
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("image");
    } catch (err) {
      console.error("Error during sign-out:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div
        onClick={handleAvatarClick}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`rounded-full cursor-pointer ${
          dragActive ? "ring-4 ring-blue-400" : ""
        }`}
      >
        <Avatar className="w-32 h-32 border shadow-lg">
          <AvatarImage src={uploadedImageUrl || user.image} alt={user.email} />
          <AvatarFallback>{user.email[0]}</AvatarFallback>
        </Avatar>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <div>
        <p className="font-medium">{user.email}</p>
      </div>

      {isUploading && (
        <div className="text-blue-500 mt-2">Uploading...</div> // Provide feedback when uploading
      )}

      {/* Sign Out Button */}
      <Button onClick={handleSignOut} type="submit" className="w-full">
        Sign Out
      </Button>
    </div>
  );
}
