import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export default function LoggedInCard({
  setLoggedInUser,
  setShowSignUp, // Add this prop to reset the showSignUp state
}: {
  setLoggedInUser: React.Dispatch<React.SetStateAction<any>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { user, uploadAndSetProfileImage, logout } = useAuth();
  const [uploadedImageUrl, setUploadedImageUrl] = useState(() => {
    return localStorage.getItem("image") || user?.image;
  });
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State to track upload progress
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true); // Start the uploading process
    try {
      await uploadAndSetProfileImage(file);
      const updatedUrl = localStorage.getItem("image");
      setUploadedImageUrl(updatedUrl || user?.image);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false); // End the uploading process
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/")) {
      handleUpload(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSignOut = async () => {
    try {
      await logout(); // Call the logout function from useAuth

      // Reset the logged-in user state
      setLoggedInUser(null); // This will bring back the LoginForm
      setShowSignUp(false); // Reset the sign-up state to show LoginForm

      // Optionally clear other localStorage items if needed
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
