// src/app/config/env.ts

export const config = {
  baseUrl: 'http://localhost:3000',
  endpoints: {
    auth: {
      login: 'auth/login',
      register: 'auth/register',
    },
    pedidos: 'pedidos',
    pedidoById: (id: number) => `pedidos/${id}`, // útil para detalle
  },
}
