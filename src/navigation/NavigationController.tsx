import HomeView from "../components/HomeView";
import SermonList from "../components/SermonList";
import ContactPage from "../components/ContactPage";
import FacebookFeeds from "../components/FacebookFeeds";
import EventsPage from "../components/EventsPage";
import TestimoniesPage from "../components/TestimoniesPage";
import ArticlePage from "../components/ArticlePage";
import Dashboard from "../dashboard/Dashboard";

import Favorites from "../pages/Favorites";

import type { AppView } from "./navigationTypes";

interface Props {
  currentView: AppView;
  searchQuery: string;
  onNavigate: (view: AppView) => void;
}

export default function NavigationController({
  currentView,
  searchQuery,
  onNavigate,
}: Props) {
  switch (currentView) {
  case "dashboard":
    return <Dashboard />;
    case "favorites":
      return <Favorites />;

    case "sermons":
      return (
        <SermonList
          searchQuery={searchQuery}
          view="sermons"
        />
      );

    case "browse":
      return (
        <SermonList
          searchQuery={searchQuery}
          view="browse"
        />
      );

    case "events":
      return <EventsPage />;

    case "testimonies":
      return <TestimoniesPage />;

    case "articles":
      return <ArticlePage />;

    case "facebook":
      return <FacebookFeeds />;

    case "contact":
      return <ContactPage />;

    case "home":
    default:
      return (
        <HomeView
          onNavigate={onNavigate}
        />
      );
  }
}