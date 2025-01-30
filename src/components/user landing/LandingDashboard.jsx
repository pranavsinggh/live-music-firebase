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

  useEffect(() => {
    fetchAlbums();
  }, []);
  return (
    <section className="w-[84%] bg-slate-700 px-2">
      <article>
        <aside>
          <h1 className="text-2xl p-2 mb-2">Albums</h1>
          <main className="flex gap-6">
            {loading ? (
              <div className="h-[600px] w-full flex justify-center items-center">
                <Spinner />
              </div>
            ) : (
              <>
                {albums?.map(album => {
                  return (
                    <div className="basis-[250px] mt-2 bg-slate-900 rounded-md hover:scale-105 transition-all" key={album.id}>
                      <NavLink
                        key={album.id}
                        to={`/album/${album.id}`}
                        state={album}
                      >
                        <figure>
                          <img
                            src={album.poster}
                            alt=""
                            className="h-[200px] w-full rounded-t-md object-cover"
                          />
                        </figure>
                        <main className=" py-4 px-2 ">
                          <h1>{album.title.slice(0, 20) + "..."}</h1>
                        </main>
                      </NavLink>
                    </div>
                  );
                })}
              </>
            )}
          </main>
        </aside>
      </article>
    </section>
  );
};

export default LandingDashboard;

// import { collection, getDocs } from "firebase/firestore";
// import React, { Fragment, useEffect, useState } from "react";
// import { __DB } from "../../backend/firebase";
// import Spinner from "../helpers/Spinner";
// import { NavLink } from "react-router-dom";

// const LandingDashboard = () => {
//   let [albums, setAlbums] = useState([]);
//   let [loading, setLoading] = useState(false);
//   let fetchAlbums = async () => {
//     try {
//       setLoading(true);
//       let albumCollectionRef = collection(__DB, "albums");
//       let get_albums = await getDocs(albumCollectionRef);
//       let data = get_albums.docs.map(album => {
//         return { ...album.data(), id: album.id };
//       });
//       setAlbums(data);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAlbums();
//   }, []);
//   return (
//     <section className="w-[84%] bg-slate-700 px-2">
//       <article>
//         <aside>
//           <h1 className="text-2xl p-2 mb-2">
//             Albums
//           </h1>
//           <main className="flex gap-4">
//             {loading ? (
//               <div className="h-[600px] w-full flex justify-center items-center">
//                 <Spinner />
//               </div>
//             ) : (
//               <>
//                 {albums?.map(album => {
//                   return (
//                     <Fragment key={album.id}>
//                       {album?.songs.map(song => {
//                         return (
//                           <div className="basis-[20%] mt-2" key={song.id}>
//                             <figure>
//                               <img
//                                 src={song.thumbnail}
//                                 alt=""
//                                 className="h-[200px] w-full rounded-t-md object-cover"
//                               />
//                             </figure>
//                             <main>
//                               <h1>{song.name}</h1>
//                             </main>
//                           </div>
//                         );
//                       })}
//                     </Fragment>
//                   );
//                 })}
//               </>
//             )}
//           </main>
//         </aside>
//       </article>
//     </section>
//   );
// };

// export default LandingDashboard;
