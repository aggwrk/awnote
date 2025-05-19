
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LogoutButton = () => {
  const { signOut, loading } = useAuth();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={signOut}
      disabled={loading}
      title="Logout"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
};

export default LogoutButton;
