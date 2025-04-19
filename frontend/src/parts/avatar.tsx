
/**
 * AvatarDemo Component
 * 
 * This component renders a clickable user avatar.
 * It displays the user's profile image, or a fallback.
 * The avatar's image is fetched from `localStorage` or a default image URL.
 * 
 * Props:
 * - `onClick`: A function passed from the parent component to handle click events on the avatar.
 */

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarDemo({ onClick }: { onClick: () => void }) {
  const image =
    localStorage.getItem("image") ||
    "https://moviesitebucket.nyc3.cdn.digitaloceanspaces.com/Sample_User_Icon.png";

  return (
    <Avatar
      onClick={onClick}
      className="cursor-pointer  w-12 h-12  border-black  border-2 shadow-lg"
    >
      <AvatarImage src={image} alt="@user" />
      <AvatarFallback>USER</AvatarFallback>
    </Avatar>
  );
}