import { authMiddleware } from '@clerk/nextjs';

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
  // Allow signed out users to access the specified routes:
  publicRoutes: ['/', '/sign-up', '/sign-in', '/contact'],
  ignoredRoutes: [
    '/((?!api|trpc))(_next.*|.+.[w]+$)',
    '/api/v1/testimonials',
    '/api/v1/templates/template',
    '/api/v1/support/add-ticket-public',
    '/api/v1/re-captcha-validate',
  ],
  signInUrl: '/sign-in',
  apiRoutes: ['/api/(.)', '/trpc/(.)'],
});

export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    '/((?!.+\\.[\\w]+$|_next).*)',
    // Re-include any files in the api or trpc folders that might have an extension
    '/(api|trpc)(.*)',
  ],
};
