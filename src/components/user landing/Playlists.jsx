import React, { useContext, useEffect, useState } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { AuthContextAPI } from "../../context/AuthContext";
import { __DB } from "../../backend/firebase";
import Spinner from "../helpers/Spinner";
import { NavLink } from "react-router-dom";
import { FaMusic } from "react-icons/fa";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const { authUser } = useContext(AuthContextAPI); // Get logged-in user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authUser) return; // Ensure user is logged in

    const fetchPlaylists = async () => {
      try {
        const userDocRef = doc(collection(__DB, "user_profile"), authUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setPlaylists(userData.playlists || []); // Set playlists or empty array
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
      setLoading(false)
    };

    fetchPlaylists();
  }, [authUser]);

  return (
    <section className="w-[84%] bg-slate-700 px-2">
      {loading ? (
        <div className="h-[600px] w-full flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-xl font-semibold text-white mb-4">
            Your Playlists
          </h2>
          {playlists.length > 0 ? (
            <main className="flex gap-6">
              {playlists.map(playlist => (
                <div
                  className="basis-[250px] mt-2 bg-slate-900 rounded-md hover:scale-105 transition-all"
                  key={playlist.id}
                >
                  <NavLink
                    to={`/playlists/${playlist.id}`}
                    state={{ playlist }}
                  >
                    <figure className="relative">
                      {playlist.poster ? (
                        <img
                          src={playlist.poster}
                          alt="Playlist Poster"
                          className="h-[200px] w-full object-cover"
                        />
                      ) : (
                        <div className="h-[200px] w-full flex flex-col items-center justify-center bg-gradient-to-r from-gray-800 to-gray-600 text-white">
                          <FaMusic className="text-4xl mb-2 opacity-75" />
                          <p className="text-sm font-semibold opacity-75">
                            No Poster Available
                          </p>
                        </div>
                      )}
                    </figure>
                    <main className="py-4 px-4">
                      <h1 className="text-white text-lg font-semibold truncate">
                        {playlist.name.length > 20
                          ? playlist.name.slice(0, 20) + "..."
                          : playlist.name}
                      </h1>
                      <p className="text-gray-400 text-sm">
                        {playlist.songs?.length || 0} songs
                      </p>
                    </main>
                  </NavLink>
                </div>
              ))}
            </main>
          ) : (
            <p className="text-gray-400">No playlists found.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default Playlists;
