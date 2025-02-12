import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { __DB } from "../backend/firebase";
import { AuthContextAPI } from "./AuthContext";

export const AudioContext = createContext(null);

const AudioContextProvider = ({ children }) => {
  const { authUser } = useContext(AuthContextAPI);
  const uid = authUser?.uid;
  const [loading, setLoading] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [allSongs, setAllSongs] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const albumCollectionRef = collection(__DB, "albums");
        const get_albums = await getDocs(albumCollectionRef);
        const album_data = get_albums.docs.map(album => ({
          ...album.data(),
          id: album.id,
        }));
        setAlbums(album_data);

        const songCollectionRef = collection(__DB, "songs");
        const get_songs = await getDocs(songCollectionRef);
        const song_data = get_songs.docs.map(song => ({
          ...song.data(),
          id: song.id,
        }));
        setAllSongs(song_data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return (
    <AudioContext.Provider value={{ albums, allSongs, loading }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContextProvider;
