import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    const doLogout = async () => {
      await logout();
      localStorage.removeItem("user");
      window.location.reload();
    };

    doLogout();
  }, []);

  return (
    <div className="p-6 text-center">
      Logging out...
    </div>
  );
}