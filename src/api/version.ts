/**
 * Version endpoint handler
 * Returns the current API version without requiring authentication
 */

export interface VersionResponse {
  version: string;
}

/**
 * Handle GET /api/version requests
 * Returns HTTP 200 with hardcoded version string '1.0.0'
 */
export function getVersion(): VersionResponse {
  return {
    version: '1.0.0'
  };
}
