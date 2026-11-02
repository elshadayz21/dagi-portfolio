import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Tekhaf Admin Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dagim@tekhaf.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const isValidDagim =
          (credentials.email.toLowerCase() === "dagim@tekhaf.com" ||
            credentials.email.toLowerCase() === "admin@tekhaf.com") &&
          (credentials.password === "admin123" || credentials.password === "tekhaf2026");

        if (isValidDagim) {
          return {
            id: "user-dagim-superadmin",
            name: "Dagim Melese",
            email: "dagim@tekhaf.com",
            role: "SUPER_ADMIN",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "SUPER_ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "tekhaf-tractor-platform-super-secret-key-dagim-melese-2026",
};
