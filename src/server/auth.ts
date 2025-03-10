import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

interface TokenErrorResponse {
  error: string;
  error_description: string;
}

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid https://www.googleapis.com/auth/webmasters.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account) {
        console.log("Initial sign in - storing tokens:", {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
        });

        // Ensure we have a refresh token
        if (!account.refresh_token) {
          console.error("No refresh token received during sign in");
          throw new Error("No refresh token received");
        }

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.id = profile?.sub;
      }

      // Return previous token if the access token has not expired yet
      if (
        token.expiresAt &&
        typeof token.expiresAt === "number" &&
        Date.now() < token.expiresAt * 1000
      ) {
        return token;
      }

      // Access token has expired, try to refresh it
      try {
        if (!token.refreshToken || typeof token.refreshToken !== "string") {
          console.error("No valid refresh token available in token:", {
            hasRefreshToken: !!token.refreshToken,
            refreshTokenType: typeof token.refreshToken,
          });
          throw new Error("No valid refresh token available");
        }

        console.log("Attempting to refresh token...");
        const params = new URLSearchParams();
        params.append("client_id", process.env.GOOGLE_CLIENT_ID!);
        params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET!);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", token.refreshToken);

        const response = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params,
        });

        const data = await response.json();

        if (!response.ok) {
          const errorData = data as TokenErrorResponse;
          console.error("Token refresh failed:", errorData);
          // If refresh token is invalid, clear the tokens and force re-auth
          if (response.status === 400 && errorData.error === "invalid_grant") {
            return {
              ...token,
              accessToken: undefined,
              refreshToken: undefined,
              expiresAt: undefined,
              error: "RefreshAccessTokenError",
            };
          }
          throw errorData;
        }

        const tokens = data as TokenResponse;
        console.log("Token refresh successful");

        return {
          ...token,
          accessToken: tokens.access_token,
          expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
        };
      } catch (error) {
        console.error("Error refreshing access token", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: true,
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
