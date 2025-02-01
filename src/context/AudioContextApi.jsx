import { collection, getDocs } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { __DB } from "../backend/firebase";

export const AudioContext = createContext(null);

const AudioContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
    const [albums, setAlbums] = useState([]);
    
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const albumCollectionRef = collection(__DB, "albums");
        const get_albums = await getDocs(albumCollectionRef);
        const data = get_albums.docs.map(album => ({
          ...album.data(),
          id: album.id,
        }));
        setAlbums(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);
    
    
  return (
    <AudioContext.Provider value={{ albums , loading }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContextProvider;
