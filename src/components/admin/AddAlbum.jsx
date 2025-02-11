import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { __DB } from "../../backend/firebase";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Spinner from "../helpers/Spinner";

const AddAlbum = () => {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const navigate = useNavigate();

  const [album, setAlbum] = useState({
    title: "",
    poster: null,
    description: "",
    date: "",
    artist: "",
    director: "",
    songs: [],
  });

  const [song, setSong] = useState({
    name: "",
    src: null,
    thumbnail: null,
    singers: "",
    musicDirector: "",
    songDate: "",
    genre: "",
    language: "",
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [songs, setSongs] = useState([]);

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
    setSong(prev => ({ ...prev, [name]: value }));
  };

  const addOrUpdateSong = () => {
    if (editingIndex !== null) {
      setSongs(prev => {
        const updatedSongs = [...prev];
        updatedSongs[editingIndex] = song;
        return updatedSongs;
      });
      setEditingIndex(null);
    } else {
      setSongs(prev => [...prev, song]);
    }
    resetSongForm();
  };

  const editSong = index => {
    setSong(songs[index]);
    setEditingIndex(index);
  };

  const deleteSong = index => {
    setSongs(prev => prev.filter((_, i) => i !== index));
  };

  const resetSongForm = () => {
    setSong({
      name: "",
      src: null,
      thumbnail: null,
      singers: "",
      musicDirector: "",
      songDate: "",
      genre: "",
      language: "",
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0); // Reset progress before starting upload

    try {
      // Upload album poster to Cloudinary
      let posterData = new FormData();
      posterData.append("file", album.poster);
      posterData.append("upload_preset", "music-album");
      posterData.append("cloud_name", "de19mc5cy");

      const posterResponse = await fetch(
        `https://api.cloudinary.com/v1_1/de19mc5cy/upload`,
        {
          method: "POST",
          body: posterData,
          onUploadProgress: e => {
            if (e.lengthComputable) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total)); // Track progress
            }
          },
        }
      );

      const posterResult = await posterResponse.json();
      const posterUrl = posterResult.url;

      // Collection references
      const songsCollection = collection(__DB, "songs");
      const albumCollection = collection(__DB, "albums");

      let songIds = []; // To store uploaded song IDs

      // Loop through songs and upload them individually
      for (let song of songs) {
        // Upload song source file
        let srcData = new FormData();
        srcData.append("file", song.src);
        srcData.append("upload_preset", "music-album");
        srcData.append("cloud_name", "de19mc5cy");

        const srcResponse = await fetch(
          `https://api.cloudinary.com/v1_1/de19mc5cy/upload`,
          {
            method: "POST",
            body: srcData,
            onUploadProgress: e => {
              if (e.lengthComputable) {
                setUploadProgress(Math.round((e.loaded * 100) / e.total)); // Track progress for song upload
              }
            },
          }
        );

        const srcResult = await srcResponse.json();
        let srcUrl = srcResult.url;
        let duration = srcResult.duration;
        let bytes = srcResult.bytes;
        let format = srcResult.format;

        // Upload song thumbnail
        let thumbnailData = new FormData();
        thumbnailData.append("file", song.thumbnail);
        thumbnailData.append("upload_preset", "music-album");
        thumbnailData.append("cloud_name", "de19mc5cy");

        const thumbnailResponse = await fetch(
          `https://api.cloudinary.com/v1_1/de19mc5cy/upload`,
          {
            method: "POST",
            body: thumbnailData,
            onUploadProgress: e => {
              if (e.lengthComputable) {
                setUploadProgress(Math.round((e.loaded * 100) / e.total)); // Track progress for thumbnail upload
              }
            },
          }
        );

        const thumbnailResult = await thumbnailResponse.json();
        let thumbnailUrl = thumbnailResult.url;

        // Create song document in Firestore
        let songPayload = {
          name: song.name,
          src: srcUrl,
          thumbnail: thumbnailUrl,
          duration,
          bytes,
          format,
          singers: song.singers,
          musicDirector: song.musicDirector,
          songDate: song.songDate,
          genre: song.genre,
          language: song.language,
        };

        const songDoc = await addDoc(songsCollection, songPayload);
        songIds.push(songDoc.id); // Store song ID
      }

      // Create album document with song IDs
      let albumPayload = {
        title: album.title,
        poster: posterUrl,
        description: album.description,
        date: album.date,
        artist: album.artist,
        director: album.director,
        songs: songIds, // Store only the song IDs
      };

      await addDoc(albumCollection, albumPayload);

      toast.success("Album created successfully");
      navigate("/admin");
    } catch (error) {
      console.log(error);
      toast.error("Error creating album");
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <section className="h-[90.5vh] p-8 w-[80%] mx-auto flex items-center">
      <article className="bg-white rounded-lg shadow-lg p-10 w-full scale-90">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Uploading files</h1>
        </header>
        {/* Show progress bar during upload */}
        <div className="w-full bg-gray-200 h-2 mb-4 rounded-md">
          <div
            className="bg-green-500 h-2 rounded-md"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      </article>
    </section>
  ) : (
    <section className="min-h-screen p-8 w-[80%] mx-auto">
      <article className="bg-white rounded-lg shadow-lg p-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create an Album</h1>
        </header>
        <form onSubmit={handleSubmit} className="text-gray-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
              Album Title
              <input
                type="text"
                name="title"
                value={album.title}
                onChange={handleAlbumChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Album Poster
              <input
                type="file"
                onChange={e => handleFileChange(e, "poster")}
                className="w-full border p-2 rounded-md"
                accept="image/*"
              />
            </label>
            <label>
              Artist
              <input
                type="text"
                name="artist"
                value={album.artist}
                onChange={handleAlbumChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Director
              <input
                type="text"
                name="director"
                value={album.director}
                onChange={handleAlbumChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Release Date
              <input
                type="date"
                name="date"
                value={album.date}
                onChange={handleAlbumChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={album.description}
                onChange={handleAlbumChange}
                className="w-full border px-2 h-[43px] rounded-md"
              ></textarea>
            </label>
          </div>
          <h2 className="text-xl font-bold">Add Songs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label>
              Song Name
              <input
                type="text"
                name="name"
                value={song.name}
                onChange={handleSongChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Song File
              <input
                type="file"
                onChange={e => handleFileChange(e, "src")}
                className="w-full border p-2 rounded-md"
                accept="audio/*"
              />
            </label>
            <label>
              Thumbnail
              <input
                type="file"
                onChange={e => handleFileChange(e, "thumbnail")}
                className="w-full border p-2 rounded-md"
                accept="image/*"
              />
            </label>
            <label>
              Singers
              <input
                type="text"
                name="singers"
                value={song.singers}
                onChange={handleSongChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Music Director
              <input
                type="text"
                name="musicDirector"
                value={song.musicDirector}
                onChange={handleSongChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Genre
              <input
                type="text"
                name="genre"
                value={song.genre}
                onChange={handleSongChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Language
              <input
                type="text"
                name="language"
                value={song.language}
                onChange={handleSongChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
            <label>
              Song Release Date
              <input
                type="date"
                name="songDate"
                value={song.songDate}
                onChange={handleSongChange}
                className="w-full border p-2 rounded-md"
              />
            </label>
          </div>
          <button
            type="button"
            onClick={addOrUpdateSong}
            className="px-6 py-2 bg-green-600 text-white rounded-md"
          >
            {editingIndex !== null ? "Update Song" : "Add Song"}
          </button>
          {songs.length > 0 && (
            <ul className="">
              {songs.map((s, index) => (
                <li key={index} className="p-4 border rounded-md mt-4">
                  <p>
                    <strong>Song name: {s.name}</strong>
                  </p>
                  <p>Singers: {s.singers}</p>
                  <p>Music Director: {s.musicDirector}</p>
                  <p>Genre: {s.genre}</p>
                  <p>Language: {s.language}</p>
                  <p>Date :{s.songDate}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => editSong(index)}
                      className="px-4 py-1 bg-blue-600 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSong(index)}
                      className="px-4 py-1 bg-red-600 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-md"
          >
            Create Album
          </button>
        </form>
      </article>
    </section>
  );
};

export default AddAlbum;

