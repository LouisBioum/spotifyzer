import { currentTrackIdState, isPlayingState } from "@/atoms/songAtom";
import useSpotify from "@/hooks/useSpotify"
import { millisToMinutesseconds } from "@/lib/time";
import { useRecoilState } from "recoil";

function Song({ order, track }) {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlayinf, setIsPlaying] = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(
          track.track.id)
        setIsPlaying(true)
        //spotifyApi.play({uris: [track.track.uri]})
    }
     //console.log(track.track)

  return (
      <div className="grid grid-cols-2 text-gray-500 py-4 hover:bg-gray-900 rounded-lg cursor-pointer"
      onClick={playSong }>
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0]?.url}
          alt=""
        />
        <div>
          <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="hidden md:inline w-40">{track.track.album.name}</p>
        <p>{millisToMinutesseconds(track.track.duration_ms)}</p>
      </div>
    </div>
  );
}
export default Song