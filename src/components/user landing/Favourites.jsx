import React, { useContext, useState, useEffect } from "react";
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
  const [favouriteAlbums, setFavouriteAlbums] = useState([]);
  const [favouriteAlbumsData, setFavouriteAlbumsData] = useState();
  const [favouriteSongs, setFavouriteSongs] = useState([]);
  const [favouriteSongsData, setFavouriteSongsData] = useState();
  const { authUser } = useContext(AuthContextAPI);
  const [loading, setLoading] = useState(true);
  let {uid}=authUser || {}

  useEffect(() => {
    setLoading(true)
    const fetchFavourites = async () => {
      const userDocRef = doc(__DB, "user_profile", uid);
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

  useEffect(() => {
    setLoading(true)
    const fetchFavouriteAlbums = async () => {
      if (favouriteAlbums?.length === 0 && favouriteSongs?.length === 0) {
        setLoading(false);
        return;
      }

      if (favouriteAlbums.length > 0) {
        const albumCollectionRef = collection(__DB, "albums");
        const albumQuery = query(
          albumCollectionRef,
          where("__name__", "in", favouriteAlbums)
        );
        const albumDocs = await getDocs(albumQuery);
        const albums = albumDocs.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavouriteAlbumsData(albums);
      }
    };

    const fetchFavouriteSongs = async () => {
      if (favouriteSongs.length > 0) {
        const songCollectionRef = collection(__DB, "songs");
        const songQuery = query(
          songCollectionRef,
          where("__name__", "in", favouriteSongs)
        );
        const songDocs = await getDocs(songQuery);
        const songs = songDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavouriteSongsData(songs);
      }
      setLoading(false);
    };

    fetchFavouriteAlbums();
    fetchFavouriteSongs();
  }, [favouriteAlbums, favouriteSongs]);

  console.log(favouriteSongsData)

  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <>
          {favouriteAlbumsData?.length > 0 && (
            <AllAlbums
              albums={favouriteAlbumsData}
              display="Favourite albums"
            />
          )}
          {favouriteSongsData?.length > 0 && (
            <TrendingSongs
              display="Favourite songs"
              songs={favouriteSongsData}
            />
          )}
          {favouriteAlbumsData?.length === 0 &&
            favouriteSongsData?.length === 0 && (
              <h1 className="text-center text-white">No favourites present</h1>
            )}
        </>
      )}
    </section>
  );
};

export default Favourites;
