import React, { useContext } from "react";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { AuthContextAPI } from "../../context/AuthContext";
import { __DB } from "../../backend/firebase";
import Spinner from "../helpers/Spinner";
import AllAlbums from "./AllAlbums";
import TrendingSongs from "./TrendingSongs";

const Favourites = () => {
  const [favouriteAlbums, setFavouriteAlbums] = useState([]); // Stores album IDs
  const [favouriteAlbumsData, setFavouriteAlbumsData] = useState([]); // Stores album details

  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [favouriteSongsData, setFavouriteSongsData] = useState([]);
  const { authUser } = useContext(AuthContextAPI);
  let [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      if (!authUser?.uid) {
        return setLoading(false);
      }

      const userDocRef = doc(__DB, "user_profile", authUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const favouritesAlbum = userDocSnap.data().favouriteAlbum || [];
        const favouritesSong = userDocSnap.data().favouriteSong || [];
        setFavouriteAlbums(favouritesAlbum);
        setFavouriteSongs(favouritesSong);
      }
    };

    fetchFavourites();
  }, [authUser?.uid]);

  console.log(favouriteSongs);

  useEffect(() => {
    const fetchFavouriteAlbums = async () => {
      if (favouriteAlbums.length === 0) return;

      const albumCollectionRef = collection(__DB, "albums");
      const albumQuery = query(
        albumCollectionRef,
        where("__name__", "in", favouriteAlbums)
      );
      const albumDocs = await getDocs(albumQuery);

      const albums = albumDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFavouriteAlbumsData(albums);
    };

    const fetchFavouriteSongs = async () => {
      if (favouriteSongs.length === 0) {
        return setLoading(false);
      }

      const albumCollectionRef = collection(__DB, "albums");
      const albumDocs = await getDocs(albumCollectionRef); // Get all albums

      let favSongs = [];
      albumDocs.docs.forEach(doc => {
        const albumData = doc.data();
        const matchedSongs = albumData.songs.filter(song =>
          favouriteSongs.includes(song.id)
        );

        if (matchedSongs.length > 0) {
          favSongs = [
            ...favSongs,
            ...matchedSongs.map(song => ({ ...song, albumId: doc.id })),
          ];
        }
      });

      setLoading(false);
      setFavouriteSongsData(favSongs);
    };

    fetchFavouriteAlbums();
    fetchFavouriteSongs();
  }, [favouriteAlbums, favouriteSongs]);

  console.log(favouriteSongsData);

  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          {favouriteAlbumsData.length > 0 && (
            <AllAlbums
              albums={favouriteAlbumsData}
              display="Favourite albums"
            />
          )}
          {favouriteSongsData.length > 0 && (
            <TrendingSongs
              display="Favourite songs"
              songs={favouriteSongsData}
            />
          )}
          {favouriteAlbumsData.length === 0 && favouriteSongsData.length === 0 && (
            <h1>No favourites present</h1>
          )}
        </>
      )}
    </section>
  );
};

export default Favourites;
