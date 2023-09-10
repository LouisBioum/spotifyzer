"use client";;

import { playlistIdState } from "@/atoms/playlistAtom";
import useSpotify from "@/hooks/useSpotify";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
    PlusCircleIcon,
    HeartIcon,
  RSSIcon
} from "@heroicons/react/24/outline";
// import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";


function Sidebar() {
  // const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  //console.log(session)
  console.log("You picked playlist >>>", playlistId)

  let token = null;
  useEffect(() => {
    // console.log(spotifyApi)
    if (spotifyApi.getAccessToken()) {
      console.log("Got access token")
      spotifyApi
        .getUserPlaylists("119549609")
        .then((data) => {
          setPlaylists(data.body.items);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });

    }
  }, [session, spotifyApi])
  return (
    <div className="text-gray-500 p-5 text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen">
      <div className="space-y-4">
              <button
                  className="flex items-center space-x-2 hover:text-white"
                  onClick={() => signOut()}
              >
          <p>Log out</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="h-5 w-5" />
          <p>your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon clas sName="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RSSIcon className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlist */}
        {playlists.map(playlist => (
          <p key={playlist.id} onClick={()=>setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">{ playlist.name}</p>
        ))}
        
      </div>
    </div>
  );
}
export default Sidebar

// export async function getServerSideProps() {
//   const {data, session} = getServerSession()
//   return {
//     props: {
//       session
//     }
//   }
// }