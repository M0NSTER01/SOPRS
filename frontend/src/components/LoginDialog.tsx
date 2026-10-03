import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

import { useNavigate } from "react-router-dom";

interface LoginDialogProps {
  triggerClassName?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerSize?: "default" | "sm" | "lg" | "icon";
}

export const LoginDialog: React.FC<LoginDialogProps> = ({
  triggerClassName,
  triggerVariant = "default",
  triggerSize = "default",
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const role = await login(username, password);

    if (role) {
      toast.success("Login successful!");
      setOpen(false);
      setUsername("");
      setPassword("");
      
      if (role === 'admin') {
        navigate("/admin");
      } else if (role === 'police') {
        navigate("/police");
      } else {
        navigate("/");
      }
    } else {
      toast.error("Invalid credentials");
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={triggerVariant} 
          size={triggerSize}
          className={triggerClassName || "h-10 px-5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white shadow-[0_0_16px_rgba(56,189,248,0.3)] transition-all duration-150"}
        >
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login to FindMyNet</DialogTitle>
          <DialogDescription>
            Use sample credentials: username "sample", password "sample"
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (sample)"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (sample)"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};