/**
 * Middleware to skip authentication for public routes
 * This allows routes like /api/ping to be accessible without auth
 */
export const publicRoutes = [
  '/api/ping'
];

export const isPublicRoute = (path: string): boolean => {
  return publicRoutes.some(route => path.startsWith(route));
};
