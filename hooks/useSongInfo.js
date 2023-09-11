import { useRecoilState } from "recoil";
import useSpotify from "./useSpotify"
import { currentTrackIdState } from "@/atoms/songAtom";
import { useEffect, useState } from "react";


function useSongInfo() {
  const [songInfo, setSongInfo] = useState(null);
  const spotifyApi = useSpotify();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);

  useEffect(() => {

    const fetchSongInfo = async () => {
      if (currentTrackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`
            }
          }
        ).then(res => res.json()).catch((err) => console.log(err))
        setSongInfo(trackInfo)

      }
    }
    fetchSongInfo();

  }, [currentTrackId, spotifyApi]);
    
  return songInfo
}
export default useSongInfo