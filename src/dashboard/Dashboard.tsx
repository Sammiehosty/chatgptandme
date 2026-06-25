import { useDashboard } from "./DashboardContext";
import DashboardLayout from "./DashboardLayout";

import Overview from "./pages/Overview";
import {
useDashboardData
}
from "./DashboardProvider";


export default function Dashboard() {
  const { page } = useDashboard();

  function renderPage() {
    switch (page) {
      case "overview":
        return 
        
const {

latestSermons,

} = useDashboardData();

...

return (
<Overview
sermons={latestSermons}
/>
);
        ;

      case "favorites":
        return (
          <div className="text-white text-2xl">
            Favorites (Coming Soon)
          </div>
        );

      case "history":
        return (
          <div className="text-white text-2xl">
            Listening History (Coming Soon)
          </div>
        );

      case "statistics":
        return (
          <div className="text-white text-2xl">
            Statistics (Coming Soon)
          </div>
        );

      case "achievements":
        return (
          <div className="text-white text-2xl">
            Achievements (Coming Soon)
          </div>
        );

      case "notifications":
        return (
          <div className="text-white text-2xl">
            Notifications (Coming Soon)
          </div>
        );

      case "settings":
        return (
          <div className="text-white text-2xl">
            Settings (Coming Soon)
          </div>
        );

      default:
        return <Overview sermons={[]} />;
    }
  }

  return (
    <DashboardLayout>
      {renderPage()}
    </DashboardLayout>
  );
}