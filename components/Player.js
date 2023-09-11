import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom"
import useSongInfo from "@/hooks/useSongInfo"
import useSpotify from "@/hooks/useSpotify"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { HeartIcon, SpeakerWaveIcon as VolumeDownIcon } from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  ArrowUturnLeftIcon,
  SpeakerWaveIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)
  const songInfo = useSongInfo()
  // console.log(songInfo)

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        // console.log("Now playing: ", data.body?.item)
        setCurrentTrackId(data.body?.item.id)
      })

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data.body?.is_playing)
      }).catch((error) => console.log(error))
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    }).catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchCurrentSong()
    setVolume(50)
    console.log(`isPlaying : ${isPlaying}`)
  }, [currentTrackIdState, spotifyApi, session])
  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white 
    grid grid-col-3 text-xs md:text-base px-2 md:px-8"
    >
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon className="button" />
        {/* onClick={() => spotifyApi.skipToPrevious()} - Check if working (premium)*/}

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <ForwardIcon className="button" />
        {/* {onclick{() => spotifyApi.skipToNext()}} - Check if working (premium)*/}
      </div>
    </div>
  );
}
export default Player