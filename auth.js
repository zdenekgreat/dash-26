import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        // Kontrola, co skutečně přichází z ENV
        const user = process.env.ADMIN_USER;
        const pass = process.env.ADMIN_PASSWORD;

        console.log("--- DEBUG AUTH ---");
        console.log("ENV USER:", user);
        console.log("LOGIN ATTEMPT:", credentials?.username);

        if (!user || !pass) {
          console.error("KRITICKÁ CHYBA: Chybí ADMIN_USER nebo ADMIN_PASSWORD v .env.local!");
          return null;
        }

        if (credentials?.username === user && credentials?.password === pass) {
          return { id: "1", name: "Admin" };
        }
        
        return null;
      },
    }),
  ],
  // Vynucení tajného klíče (pokud je undefined, přihlášení selže)
  secret: process.env.NEXTAUTH_SECRET || "docasne-heslo-pro-test-123",
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login", // Přesměruje chyby zpět na login místo defaultní error stránky
  },
});