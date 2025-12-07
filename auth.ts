// auth.ts
import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "./lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      // Request additional scopes to get email
      authorization: {
        params: {
          scope: "read:user user:email", // This ensures we get email
        },
      },
      profile(profile) {
        console.log("GitHub Profile Received:", {
          id: profile.id,
          name: profile.name,
          login: profile.login,
          email: profile.email,
          avatar_url: profile.avatar_url,
          bio: profile.bio,
          location: profile.location,
          company: profile.company,
        });

        return {
          // These map to your User model fields
          id: profile.id.toString(),
          name: profile.name || profile.login, // Use login if name is null
          email: profile.email, // Note: GitHub might return null if email is private
          image: profile.avatar_url,
          emailVerified: profile.email ? new Date() : null,

          // Additional info that can be stored in session/token (not in DB)
          username: profile.login,
          bio: profile.bio,
          location: profile.location,
          company: profile.company,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;

        // Store additional GitHub info in token (not in DB)
        token.username = (user as any).username;
        token.bio = (user as any).bio;
        token.location = (user as any).location;
        token.company = (user as any).company;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Basic user info from DB
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;

        // Additional GitHub info from token
        (session.user as any).username = token.username as string;
        (session.user as any).bio = token.bio as string;
        (session.user as any).location = token.location as string;
        (session.user as any).company = token.company as string;
        (session.user as any).githubId = token.sub; // GitHub ID

        // Debug: Log what's in session
        console.log("Session User Data:", session.user);
      }
      return session;
    },
  },
  // Events to debug
  events: {
    async signIn(message) {
      console.log("SignIn Event:", {
        user: message.user,
        account: message.account,
        profile: message.profile,
      });
    },
    async createUser(message) {
      console.log("Create User Event - User saved to DB:", {
        id: message.user.id,
        name: message.user.name,
        email: message.user.email,
        image: message.user.image,
      });
    },
  },
  debug: process.env.NODE_ENV === "development",
});
