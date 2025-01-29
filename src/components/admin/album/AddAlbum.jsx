import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { __DB } from "../../../backend/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../../helpers/Spinner";

const AddAlbum = () => {
  let [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const [album, setAlbum] = useState({
    title: "",
    poster: null,
    language: "",
    description: "",
    date: "",
    albumType: "",
    songs: [],
  });

  const [song, setSong] = useState({
    id: "",
    name: "",
    src: null,
    thumbnail: null,
    artists: {
      singers: [],
      lyricists: [],
      musicDirector: "",
      actors: [],
      director: "",
    },
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const handleAlbumChange = e => {
    const { name, value } = e.target;
    setAlbum(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "poster") {
      setAlbum(prev => ({ ...prev, poster: file }));
    } else {
      setSong(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleSongChange = e => {
    const { name, value } = e.target;

    setSong(prev => ({
      ...prev,
      ...(name in prev.artists
        ? { artists: { ...prev.artists, [name]: value } }
        : { [name]: value }),
    }));
  };

  const addArtist = (type, value) => {
    if (!value.trim()) return;
    setSong(prev => ({
      ...prev,
      artists: {
        ...prev.artists,
        [type]: [...prev.artists[type], value.trim()],
      },
    }));
  };

  const removeArtist = (type, index) => {
    setSong(prev => ({
      ...prev,
      artists: {
        ...prev.artists,
        [type]: prev.artists[type].filter((_, i) => i !== index),
      },
    }));
  };

  const addOrUpdateSong = () => {
    if (editingIndex !== null) {
      setAlbum(prev => {
        const updatedSongs = [...prev.songs];
        updatedSongs[editingIndex] = song;
        return { ...prev, songs: updatedSongs };
      });
      setEditingIndex(null);
    } else {
      setAlbum(prev => ({
        ...prev,
        songs: [...prev.songs, song],
      }));
    }
    resetSongForm();
  };

  const editSong = index => {
    setSong(album.songs[index]);
    setEditingIndex(index);
  };

  const deleteSong = index => {
    setAlbum(prev => ({
      ...prev,
      songs: prev.songs.filter((_, i) => i !== index),
    }));
  };

  const resetSongForm = () => {
    setSong({
      name: "",
      src: null,
      thumbnail: null,
      artists: {
        singers: [],
        lyricists: [],
        musicDirector: "",
        actors: [],
        director: "",
      },
    });

    document.querySelectorAll('input[type="file"]').forEach(input => {
      input.value = "";
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      let posterData = new FormData();
      posterData.append("file", album.poster);
      posterData.append("upload_preset", "music-album"); // Replace with your upload preset
      posterData.append("cloud_name", "de19mc5cy");

      const posterResponse = await fetch(
        `https://api.cloudinary.com/v1_1/de19mc5cy/upload`,
        {
          method: "POST",
          body: posterData,
        }
      );

      const posterResult = await posterResponse.json();
      const posterUrl = posterResult.url;

      let songsData = album.songs?.map(async song => {
        let srcData = new FormData();
        srcData.append("file", song.src);
        srcData.append("upload_preset", "music-album"); // Replace with your upload preset
        srcData.append("cloud_name", "de19mc5cy");

        const srcResponse = await fetch(
          `https://api.cloudinary.com/v1_1/de19mc5cy/upload`,
          {
            method: "POST",
            body: srcData,
          }
        );

        const srcResult = await srcResponse.json();
        let srcUrl = srcResult.url;
        let songId = srcResult.asset_id;

        let thumbnailData = new FormData();
        thumbnailData.append("file", song.thumbnail);
        thumbnailData.append("upload_preset", "music-album"); // Replace with your upload preset
        thumbnailData.append("cloud_name", "de19mc5cy");

        const thumbnailResponse = await fetch(
          `https://api.cloudinary.com/v1_1/de19mc5cy/upload`,
          {
            method: "POST",
            body: thumbnailData,
          }
        );

        const thumbnailResult = await thumbnailResponse.json();
        let thumbnailUrl = thumbnailResult.url;

        return {
          id: songId,
          name: song.name,
          src: srcUrl,
          thumbnail: thumbnailUrl,
          artists: {
            singers: song.artists.singers,
            lyricists: song.artists.lyricists,
            musicDirector: song.artists.musicDirector,
            director: song.artists.director,
            actors: song.artists.actors,
          },
        };
      });

      let songs = await Promise.all(songsData);

      let payload = {
        title: album.title,
        poster: posterUrl,
        language: album.language,
        description: album.description,
        date: album.date,
        albumType: album.albumType,
        songs,
      };

      console.log(payload);

      const album_collection = collection(__DB, "albums");
      await addDoc(album_collection, payload);

      toast.success("Album created");
      navigate("/admin");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <div className="h-[700px] flex items-center justify-center">
      <Spinner />
    </div>
  ) : (
    <section className="min-h-screen  p-8 w-[80%] mx-auto">
      <article className="bg-white rounded-lg shadow-lg p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create an Album</h1>
        </header>
        <form onSubmit={handleSubmit} className="text-gray-700 space-y-6">
          {/* Album Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label>
                Album Title:
                <input
                  type="text"
                  name="title"
                  value={album.title}
                  onChange={handleAlbumChange}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Album Poster:
                <input
                  type="file"
                  onChange={e => handleFileChange(e, "poster")}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Language:
                <input
                  type="text"
                  name="language"
                  value={album.language}
                  onChange={handleAlbumChange}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Release Date:
                <input
                  type="date"
                  name="date"
                  value={album.date}
                  onChange={handleAlbumChange}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Description:
                <textarea
                  name="description"
                  value={album.description}
                  onChange={handleAlbumChange}
                  className="w-full border p-2 rounded-md mt-1 h-[42px]"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Genre:
                <select
                  name="albumType"
                  value={album.albumType}
                  onChange={handleAlbumChange}
                  className="w-full border p-2 rounded-md mt-1 h-[42px]"
                >
                  <option value="">Select Genre</option>
                  <option value="Jazz">Jazz</option>
                  <option value="Sad">Sad</option>
                  <option value="Romantic">Romantic</option>
                  <option value="Party">Party</option>
                </select>
              </label>
            </div>
          </div>

          {/* Song Details */}
          <h2 className="text-xl font-bold">Add Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label>
                Song Name:
                <input
                  type="text"
                  name="name"
                  value={song.name}
                  onChange={handleSongChange}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Director:
                <input
                  type="text"
                  name="director"
                  value={song.artists.director}
                  onChange={handleSongChange}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Song File:
                <input
                  type="file"
                  onChange={e => handleFileChange(e, "src")}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Thumbnail:
                <input
                  type="file"
                  onChange={e => handleFileChange(e, "thumbnail")}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            <div className="flex flex-col">
              <label>
                Music Director:
                <input
                  type="text"
                  name="musicDirector"
                  value={song.artists.musicDirector}
                  onChange={handleSongChange}
                  className="w-full border p-2 rounded-md mt-1"
                />
              </label>
            </div>
            {["singers", "lyricists", "actors"].map(type => (
              <div key={type} className="flex flex-col">
                <label>
                  {type.charAt(0).toUpperCase() + type.slice(1)}:
                  <input
                    type="text"
                    placeholder={`Add ${type}, separated by Enter`}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addArtist(type, e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="w-full border p-2 rounded-md mt-1"
                  />
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {song.artists[type].map((artist, index) => (
                    <span
                      key={index}
                      className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {artist}
                      <button
                        onClick={() => removeArtist(type, index)}
                        className="ml-2 text-red-200"
                      >
                        ✖
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addOrUpdateSong}
              className="px-6 py-2 bg-green-600 text-white rounded-md col-span-2"
            >
              {editingIndex !== null ? "Update Song" : "Add Song"}
            </button>
          </div>

          {/* Song List */}
          <ul className="mt-4">
            {album.songs.map((s, index) => (
              <li key={index} className="p-4 border rounded-md mt-4">
                <p>
                  <strong>Song name: {s.name}</strong>
                </p>
                <p>Singers: {s.artists.singers.join(", ")}</p>
                <p>Lyricists: {s.artists.lyricists.join(", ")}</p>
                <p>Music Director: {s.artists.musicDirector}</p>
                <p>Director: {s.artists.director}</p>
                <p>Actors: {s.artists.actors.join(", ")}</p>
                <input
                  type="button"
                  onClick={() => editSong(index)}
                  className="text-blue-500 mr-4 cursor-pointer"
                  value="Edit"
                />

                <button
                  onClick={() => deleteSong(index)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md"
          >
            Create album
          </button>
        </form>
      </article>
    </section>
  );
};

export default AddAlbum;
