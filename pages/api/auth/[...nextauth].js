import spotifyApi, { LOGIN_URL } from "@/lib/spotify";
import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

async function refreshAccessToken(token) {
    try {

        spotifyApi.setAccessToken(token.accessToken)
        spotifyApi.setRefreshToken(token.refreshToken)

        const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
        //console.log("REFRESHED TOKEN IS", refreshedToken)

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
            refreshToken: refreshedToken.refresh_token ?? token.refresh_token,
            // Replace if new one came back, else fall back to old refresh token
        }

    } catch (error) {
        //console.error(error)

        return {
            ...token,
            error: "RefreshAccessTokenError",
        }
    }
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_CLIENT_ID,
      clientSecret: process.env.NEXT_CLIENT_SECRET,
      // authorization: LOGIN_URL,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: {
          scope: [
            "user-read-email",
            "playlist-read-private",
            "playlist-read-collaborative",
            "user-read-email",
            "streaming",
            "user-read-private",
            "user-library-read",
            "user-top-read",
            // "user-library-modify"
            "user-read-playback-state",
            "user-modify-playback-state",
            "user-read-currently-playing",
            "user-read-recently-played",
            "user-follow-read",
          ].join(" "),
        },
      },
    }),
    // ...add more providers here
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      // initial sign in

      if (account) {
        console.log(account);
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at * 1000, // we are handlinig expiry times in Milliseconds hence * 1000
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        //console.log("EXISTING ACCESS TOKEN IS VALID");
        return token;
      }

      // Access token has expired, so we need to refresh it...
      //console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token);
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.name = token.name;
      session.accessTokenExpires = token.accessTokenExpires;
      return session;
    },
  },
};

export default NextAuth(authOptions);
