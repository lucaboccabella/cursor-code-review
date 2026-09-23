export interface HealthResponse {
  status: string;
  timestamp: string;
}

export function getHealth(): HealthResponse {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
