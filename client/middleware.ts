import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  console.log("Token no middleware:", token); 

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    console.log("Token ausente. Redirecionando para /login.");
    return NextResponse.redirect(loginUrl);
  }

  console.log("Acesso permitido.");
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!login|api).*)", 
  ],
};
