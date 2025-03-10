import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";

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
					scope: "openid email profile https://www.googleapis.com/auth/webmasters.readonly",
					prompt: "consent",
					access_type: "offline",
					response_type: "code",
				},
			},
		}),
	],
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account) {
				token.accessToken = account.access_token;
				token.id = profile?.sub;
			}
			return token;
		},
		async session({ session, token }) {
			session.accessToken = token.accessToken as string;
			return session;
		}
	},
	session: {
		strategy: "jwt",
	},
	debug: true,
});

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		user?: {
			name?: string | null;
			email?: string | null;
			image?: string | null;
		};
	}
	interface JWT {
		accessToken?: string;
	}
}