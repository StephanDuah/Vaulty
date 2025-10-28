import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserbyCredentials } from "./app/action/UserActions";
export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error?error=credentialsSignIn",
  },
  session: {
    maxAge: 60 * 60 * 3,
  },
  jwt: {},
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials.email;
          const password = credentials.password;

          const user = await getUserbyCredentials(email, password);

          if (!user) {
            console.error("Invalid credentials");
            return null; // Return null for invalid credentials
          }

          return user;
        } catch (error) {
          console.error("Error in authorize function:", error);
          throw new Error("Failed to authenticate");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token = {
            ...token,
            id: user.id,
            email: user.email,
            name: user.name,
            active: user.active,
          };
        }
        return token;
      } catch (error) {
        console.error("JWT Callback Error:", error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        const sessionExpired = token.exp * 1000;
        const now = Date.now();

        if (sessionExpired < now) {
          return null;
        }

        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,

          active: token.active,
        };
        return session;
      } catch (error) {
        console.error("Session Callback Error:", error);
        return session;
      }
    },
  },
});
