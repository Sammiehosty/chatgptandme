import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SermonCard from "../components/SermonCard";

export default function Favorites() {
  const { user } = useAuth();

  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    try {
      const response = await fetch(
         `https://vcc.sammiehosty.com/api/favorites.php?action=list&user_id=${user?.id}`
      );

      const data = await response.json();

      if (data.success) {
        setSermons(data.sermons || []);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-2">
          Login Required
        </h2>
        <p>Please login to view your favorite sermons.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading favorites...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        My Favorite Sermons
      </h1>

      {sermons.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="grid gap-4">
          {sermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              sermon={sermon}
              sermonList={sermons}
            />
          ))}
        </div>
      )}
    </div>
  );
}