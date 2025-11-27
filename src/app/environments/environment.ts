// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',  // Backend Quarkus
  // NÃO inclua URL do MinIO - o upload deve passar pelo backend
};