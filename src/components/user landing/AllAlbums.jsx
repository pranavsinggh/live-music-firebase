import React from "react";
import { __DB } from "../../backend/firebase";
import { NavLink } from "react-router-dom";

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
                <NavLink to={`/album/${album.id}`} state={{album}}>
                  <figure>
                    <img
                      src={album.poster}
                      alt=""
                      className="h-[200px] w-full rounded-t-md object-cover"
                    />
                  </figure>
                  <main className="py-4 px-2">
                    <h1>
                      {album.title.length > 20
                        ? album.title.slice(0, 20) + "..."
                        : album.title}
                    </h1>
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
