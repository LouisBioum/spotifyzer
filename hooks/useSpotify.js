import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
});

function useSpotify() {
    const { data: session, status } = useSession()
    
    useEffect(() => {
        if (session) {
            // If refresh access token atempt fails, direct user to login...
            if (session.error === "refreshAccessTokenError") {
                signIn()
            }

            spotifyApi.setAccessToken
            (session.user.accessToken)
        }
    }, [session])

    return spotifyApi;
}
export default useSpotify