// import { createServerClient, type CookieOptions } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   console.log("[Middleware] Request for:", request.nextUrl.pathname); // Log entry
//   let response = NextResponse.next({
//     request: {
//       headers: request.headers,
//     },
//   })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return request.cookies.get(name)?.value
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           request.cookies.set({
//             name,
//             value,
//             ...options,
//           })
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           })
//           response.cookies.set({
//             name,
//             value,
//             ...options,
//           })
//         },
//         remove(name: string, options: CookieOptions) {
//           request.cookies.set({
//             name,
//             value: '',
//             ...options,
//           })
//           response = NextResponse.next({
//             request: {
//               headers: request.headers,
//             },
//           })
//           response.cookies.set({
//             name,
//             value: '',
//             ...options,
//           })
//         },
//       },
//     }
//   )

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   console.log("[Middleware] Session found:", session); // Log session status

//   const protectedPaths = ['/', '/dashboard']; // Add other paths that need protection
//   const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname === path);
//   const isAuthPath = request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/signup';

//   if (!session && isProtectedPath) {
//     // Scenario 1: No session, accessing protected path -> Redirect to signin
//     console.log(`[Middleware] Scenario 1: No session, accessing protected path (${request.nextUrl.pathname}). Redirecting to /signin.`);
//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = '/signin';
//     redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname); // Optional: remember where user was going
//     return NextResponse.redirect(redirectUrl);
//   } else if (session && isAuthPath) {
//     // Scenario 2: Session exists, accessing auth path -> Redirect to home
//     console.log(`[Middleware] Scenario 2: Session exists, accessing auth path (${request.nextUrl.pathname}). Redirecting to /.`);
//     const redirectUrl = request.nextUrl.clone();
//     redirectUrl.pathname = '/';
//     redirectUrl.searchParams.delete('redirectedFrom'); // Clear any redirect param
//     return NextResponse.redirect(redirectUrl);
//   } else {
//     // Scenario 3: Session exists on protected path, or no session on public path, or accessing allowed paths like /signin without session
//     console.log(`[Middleware] Scenario 3: Allowing request to proceed for path: ${request.nextUrl.pathname}`);
//     // Refresh the session cookie if needed
//     // await supabase.auth.getSession() // This might implicitly refresh, check Supabase docs
//     return response;
//   }
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     // Explicitly include root and dashboard if needed beyond the general pattern
//      '/',
//      '/dashboard',
//      '/signin',
//      '/signup',
//   ],
// }

// --- Add an empty export to satisfy module requirements if everything is commented out ---
export default function middleware() {}