import { createContext, useContext, useState } from "react";
import { AuthContextAPI } from "./AuthContext";
import toast from "react-hot-toast";

export const CustomAudioPlayerContextAPI = createContext(null);

const CustomAudioPlayerProvider = ({ children }) => {
  let { authUser } = useContext(AuthContextAPI);

  const [songs, setSongs] = useState([]);
  const [audio, setAudio] = useState("");
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [type, setType] = useState();
  const [song, setSong] = useState();

  console.log(songs);

  const handlePlay = (index, allSongs) => {
    setSong(allSongs[index]);
    setSongs(allSongs);

    console.log(songs[index]);

    if (type == "album") {
      if (authUser !== null || index < 2) {
        if (currentSong === index) {
          setPlaying(!playing);
        } else {
          setAudio(allSongs[index]?.src);
          setCurrentSong(index);
          setPlaying(true);
        }
      } else {
        toast.error("Login to listen to other songs");
      }
    } else if (type == "song") {
      setAudio(allSongs[index]?.src);
      setCurrentSong(index);
      setPlaying(true);
    }
  };

  return (
    <CustomAudioPlayerContextAPI.Provider
      value={{
        songs,
        setSongs,
        audio,
        setAudio,
        playing,
        setPlaying,
        currentSong,
        setCurrentSong,
        handlePlay,
        setType,
        song,
      }}
    >
      {children}
    </CustomAudioPlayerContextAPI.Provider>
  );
};
export default CustomAudioPlayerProvider;
