/**
 * @file httpClient.ts
 * @layer Shared / API
 *
 * Cliente HTTP centralizado basado en axios.
 * Configuración de base URL, timeouts, headers y interceptores.
 *
 * REGLA: Ningún componente o hook debe usar fetch() o axios directamente.
 * Siempre importar este cliente para garantizar que todos los requests
 * pasen por los interceptores de seguridad y logging.
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const BASE_URL = 'https://pokeapi.co/api/v2';
const TIMEOUT_MS = 10_000; // 10 segundos

// ---------------------------------------------------------------------------
// Creación del cliente
// ---------------------------------------------------------------------------

export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Interceptor de REQUEST
// Agrega headers de seguridad y logging en desarrollo
// ---------------------------------------------------------------------------

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // En producción se agregaría el token de autenticación aquí
    // config.headers.Authorization = `Bearer ${getToken()}`;

    if (__DEV__) {
      console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('[HTTP] Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------------------------
// Interceptor de RESPONSE
// Manejo centralizado de errores HTTP
// ---------------------------------------------------------------------------

httpClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log(
        `[HTTP] ${response.status} ${response.config.url}`
      );
    }
    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error(
        `[HTTP] Error ${error.response?.status}:`,
        error.message
      );
    }

    // Normalizar errores para que React Query los maneje consistentemente
    return Promise.reject(error);
  }
);
