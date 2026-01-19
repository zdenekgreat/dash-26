import { auth } from "./auth";

export default auth((req) => {
  // 1. Zjistíme, zda je uživatel přihlášený
  const isLoggedIn = !!req.auth;
  
  // 2. Zjistíme, zda se uživatel nachází na přihlašovací stránce
  const isLoginPage = req.nextUrl.pathname === "/login";

  // 3. LOGIKA OCHRANY:
  // Pokud není přihlášený a není na login stránce, vyhodíme ho na login
  if (!isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }

  // Pokud je přihlášený a snaží se jít na login, pošleme ho rovnou na monitoring
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL("/monitoring", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)"],
};