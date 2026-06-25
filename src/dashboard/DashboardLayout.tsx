import { ReactNode } from "react";

import { DashboardProvider } from "./DashboardContext";

import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import {
DashboardProvider as DataDashboardProvider
}
from "./DashboardProvider";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
<DashboardProvider>

    <DataDashboardProvider>

        ...

    </DataDashboardProvider>

</DashboardProvider>
  );
}