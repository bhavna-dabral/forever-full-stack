import axios from 'axios';

const CASHFREE_ENV = (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();
const BASE_URL = CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

function resolveEnvVar(possibleNames) {
  for (const name of possibleNames) {
    if (process.env[name] && String(process.env[name]).length > 0) {
      return { value: process.env[name], name };
    }
  }
  return { value: undefined, name: undefined };
}

const CLIENT_ID_CANDIDATES = [
  'CASHFREE_CLIENT_ID',
  'CF_CLIENT_ID',
  'CASHFREE_APP_ID'
];

const CLIENT_SECRET_CANDIDATES = [
  'CASHFREE_CLIENT_SECRET',
  'CF_CLIENT_SECRET',
  'CASHFREE_SECRET_KEY'
];

export const resolvedClientId = resolveEnvVar(CLIENT_ID_CANDIDATES);
export const resolvedClientSecret = resolveEnvVar(CLIENT_SECRET_CANDIDATES);

export const cashfreeHttp = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

export function cashfreeAuthHeaders() {
  return {
    'x-client-id': resolvedClientId.value,
    'x-client-secret': resolvedClientSecret.value,
    'x-api-version': '2022-09-01'
  }
}

export const cashfreeConfig = {
  environment: CASHFREE_ENV,
  baseUrl: BASE_URL
}

export default cashfreeHttp;


