import spotifyApi from "@/lib/spotify";
import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react";
// import SpotifyWebApi from "spotify-web-api-node";

// const spotifyApi = new SpotifyWebApi({
//   clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
//   clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
// });

function useSpotify() {
    const {data: session} = useSession()
    useEffect(() => {
        if (session) {
            // If refresh access token atempt fails, direct user to login...
            if (Date.now() >= session.accessTokenExpires) {
                    signIn();
            }
            spotifyApi.setAccessToken
                (session.accessToken)

        }
    }, [session])

    return spotifyApi;
}
export default useSpotify