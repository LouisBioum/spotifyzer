import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom"
import useSongInfo from "@/hooks/useSongInfo"
import useSpotify from "@/hooks/useSpotify"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { HeartIcon, SpeakerWaveIcon as VolumeDownIcon } from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
  ArrowUturnLeftIcon,
  SpeakerWaveIcon as VolumeUpIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";
import { debounce } from "lodash"

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

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      //spotifyApi.setVolume(volume).catch((err) => {})  - Requires premium
    }, 500),
    []
  )

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume)
    }
  }, [volume])

  return (
    <div
      className="h-24 bg-gradient-to-b from-black to-gray-900 text-white 
    grid grid-cols-3 text-xs md:text-base px-2 md:px-8"
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
        <BackwardIcon
          onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />
        {/* onClick={() => spotifyApi.skipToPrevious()} - Check if working (premium)*/}

        {isPlaying ? (
          <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="button w-10 h-10" />
        )}

        <ForwardIcon
          onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
        {/* {onclick{() => spotifyApi.skipToNext()}} - Check if working (premium)*/}
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <VolumeDownIcon
        onClick={() => volume > 0 && setVolume(volume - 10)}  className="button" />
        <input className="w-14 md:w-28" type="range"
          value={volume} onChange={(e) => setVolume(Number(e.target.volume))} min={0} max={100} />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}  className="button" />
      </div>
    </div>
  );
}
export default Player