export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    INVOICES: '/invoices',
    DASHBOARD_STATS: '/dashboard/stats',
    DASHBOARD_CHARTS: '/dashboard/charts',
    PAYMENTS_PARAMS: '/payments/wompi-params',
    PAYMENTS_CONFIRM: '/payments/confirm',
    AI_ASK: '/ai/ask'
  }
};