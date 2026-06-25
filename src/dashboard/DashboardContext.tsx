import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type DashboardPage =
  | "overview"
  | "favorites"
  | "history"
  | "statistics"
  | "achievements"
  | "notifications"
  | "settings";

interface DashboardContextType {
  page: DashboardPage;
  setPage: (page: DashboardPage) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  profileMenuOpen: boolean;
  setProfileMenuOpen: (open: boolean) => void;

  search: string;
  setSearch: (value: string) => void;
}

const DashboardContext =
  createContext<DashboardContextType | null>(null);

export function DashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [page, setPage] =
    useState<DashboardPage>("overview");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);

  const [search, setSearch] =
    useState("");

  return (
    <DashboardContext.Provider
      value={{
        page,
        setPage,

        sidebarOpen,
        setSidebarOpen,

        profileMenuOpen,
        setProfileMenuOpen,

        search,
        setSearch,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context =
    useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard must be used inside DashboardProvider"
    );
  }

  return context;
}