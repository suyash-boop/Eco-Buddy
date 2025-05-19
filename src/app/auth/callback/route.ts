import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.getUser(); // Exchanges the code for a session and sets the HTTP-only cookies
  return Response.redirect(new URL('/', request.url));
}