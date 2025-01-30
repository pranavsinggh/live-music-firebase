import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { __DB } from "../../backend/firebase";
import Spinner from "../helpers/Spinner";
import { NavLink } from "react-router-dom";

const LandingDashboard = () => {
  let [albums, setAlbums] = useState([]);
  let [loading, setLoading] = useState(false);
  let fetchAlbums = async () => {
    try {
      setLoading(true);
      let albumCollectionRef = collection(__DB, "albums");
      let get_albums = await getDocs(albumCollectionRef);
      let data = get_albums.docs.map(album => {
        return { ...album.data(), id: album.id };
      });
      setAlbums(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(albums);

  useEffect(() => {
    fetchAlbums();
  }, []);
  return (
    <section className="w-[84%]">
      {loading ? (
        <div className="h-[700px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <article>
          <h1>Albums</h1>
          {albums?.map(album => {
            return (
              <NavLink key={album.id} to={`/album/${album.id}`} state={album}>
                <figure>
                  <img src={album.poster} alt="" />
                </figure>
                <h1>{album.title}</h1>
              </NavLink>
            );
          })}
        </article>
      )}
    </section>
  );
};

export default LandingDashboard;
