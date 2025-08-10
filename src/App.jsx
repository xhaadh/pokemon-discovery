import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import Discover from "./components/Discover";
import Collection from "./components/Collection";
import toast from 'react-hot-toast';

export default function App() {
  const [activeTab, setActiveTab] = useState("discover");
  const [collection, setCollection] = useState(() => {
    try {
      const raw = localStorage.getItem("my_collection_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const goingDown = currentScrollY > lastScrollY.current;

      if (goingDown && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("my_collection_v1", JSON.stringify(collection));
  }, [collection]);

  // const handleAdd = (pokemon) => {
  //   if (collection.find((p) => p.id === pokemon.id)) return;
  //   setCollection((prev) => [...prev, pokemon]);
  // };

  const handleAdd = (pokemon) => {
    if (collection.find((p) => p.id === pokemon.id)) {
      toast.error(`${pokemon.name} is already in your collection!`);
      return;
    }
    setCollection((prev) => [...prev, pokemon]);
    toast.success(`${pokemon.name} added to your collection!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} show={showHeader} />
      <main>
        {activeTab === "discover" ? (
          <Discover onAdd={handleAdd} />
        ) : (
          <Collection collection={collection} setCollection={setCollection} />
        )}
      </main>
    </div>
  );
}
