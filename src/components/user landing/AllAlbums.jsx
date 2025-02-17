import React from "react";
import { __DB } from "../../backend/firebase";
import { NavLink } from "react-router-dom";
import { FaMusic } from "react-icons/fa";

const AllAlbums = ({ albums, display }) => {
  return (
    <>
      <article>
        <aside className="mb-4">
          <h1 className="text-2xl p-2 mb-2">{display}</h1>
          <main className="flex gap-6">
            {albums.map(album => (
              <div
                className="basis-[250px] mt-2 bg-slate-900 rounded-md hover:scale-105 transition-all"
                key={album.id}
              >
                <NavLink to={`/album/${album.title}`} state={{ album }}>
                  <figure className="relative">
                    {album.poster ? (
                      <img
                        src={album.poster}
                        alt="Album Poster"
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
                      {album.title.length > 20
                        ? album.title.slice(0, 20) + "..."
                        : album.title}
                    </h1>
                    <p className="text-gray-400 text-sm">
                      {album.songs?.length || 0} songs
                    </p>
                  </main>
                </NavLink>
              </div>
            ))}
          </main>
        </aside>
      </article>
    </>
  );
};

export default AllAlbums;
