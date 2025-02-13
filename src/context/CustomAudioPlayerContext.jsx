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
  const [playType, setPlayType] = useState();
  const [song, setSong] = useState();


  const handlePlay = (index, allSongs, type) => {
    if (type == "album" || playType == "album") {
      setPlayType("album");
      if (authUser !== null || index < 2) {
        setSong(allSongs[index]);
        setSongs(allSongs);
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
    } else if (type == "song" || playType == "song") {
      setPlayType("song");
      setSong(allSongs[index]);
      setSongs(allSongs);
      setAudio(allSongs[index]?.src);
      setCurrentSong(index);
      setPlaying(true);
    }
  };

  const handleClose = () => {
    setPlayType(null)
    setSong(null)
    setSongs([])
    setAudio("")
    setCurrentSong(null)
    setPlaying(false)
  }

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
        song,
        handleClose
      }}
    >
      {children}
    </CustomAudioPlayerContextAPI.Provider>
  );
};
export default CustomAudioPlayerProvider;
