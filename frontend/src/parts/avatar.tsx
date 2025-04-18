import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AvatarDemo({ onClick }: { onClick: () => void }) {
  const image =
    localStorage.getItem("image") || "https://github.com/shadcn.png";

  return (
    <Avatar onClick={onClick} className="cursor-pointer">
      <AvatarImage src={image} alt="@user" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}