## Resumen de Modificaciones Paso a Paso

Este archivo explica de manera sencilla todas las modificaciones que realizamos en los módulos de **órdenes** y **pagos** para filtrar por usuario logueado y mantener la modularidad.

---

### 1. Preparación del Entorno

1. **Levantar la base de datos** en Docker con `docker-compose up -d`.
2. **Iniciar el backend** en modo desarrollo con `npm install` y `npm run start:dev`.
3. **Crear datos iniciales** (métodos de pago, estados y usuarios) en PostgreSQL mediante scripts SQL (`init.sql`, `init-users.sql`).

---

### 2. Modificaciones en el Módulo de Órdenes

1. **Intercepción del usuario logueado**:

   * En `orders.controller.ts`, agregamos el decorador `@Req() req: RequestWithUser` para recibir información del usuario (ID, email, rol).
2. **Filtrado en `GET /order`**:

   * Detectamos si el usuario es **ADMIN** (`user.role === Role.ADMIN`).
   * Si es admin, llamamos a `ordersService.getAllOrders()` para devolver todas las órdenes.
   * Si es cliente, llamamos a `ordersService.getOrdersByUser(user.id)` para devolver solo sus propias órdenes.
3. **Validación en `GET /order/:id`**:

   * Obtenemos la orden con `ordersService.getOrderById(id)`.
   * Si el usuario no es admin y la orden no le pertenece (`order.userId !== user.id`), lanzamos `ForbiddenException`.
4. **Servicio de Ordenes**:

   * Agregamos el método `getOrdersByUser(userId, page, limit)` que filtra usando `where: { userId }`.

---

### 3. Modificaciones en el Módulo de Pagos

1. **Intercepción del usuario logueado**:

   * En `payments.controller.ts`, agregamos `@Req() req: RequestWithUser` para acceder a `req.user`.
2. **Filtrado en `GET /payments`**:

   * Si el usuario es **ADMIN**, llamamos a `paymentsService.findAllPayments(page, limit)`.
   * Si es cliente, llamamos a `paymentsService.findPaymentsByUser(user.id, page, limit)`.
3. **Implementación de `findPaymentsByUser`** en `payments.service.ts`:

   * Un método que aplica `findAndCount` con `where: { userId }` y las mismas relaciones/paginación.
4. **Validación en `GET /payments/:id`**:

   * Modificamos `findPaymentById(id, userId, isAdmin)` para recibir `userId` e `isAdmin`.
   * Si no es admin y el pago no pertenece al usuario (`payment.userId !== userId`), lanzamos `ForbiddenException`.
5. **Validación en actualización, reembolso y eliminación**:

   * En el servicio, ajustamos:

     * `updatePaymentStatus(id, dto, userId, isAdmin)`
     * `refundPayment(id, dto, userId, isAdmin)`
     * `deletePayment(id, userId, isAdmin)`
   * Cada uno llama internamente a `findPaymentById` con los mismos parámetros para validar acceso.
6. **Ajustes en el controlador** para pasar `user.id` y `isAdmin` a cada llamada de servicio:

   * `updateStatus`, `refundPayment` y `deletePayment` ahora extraen `req.user` y pasan los parámetros de autorización.

---

### 4. Pruebas con Curl

* **Login Admin**: `POST /auth/login` con credenciales de admin.
* **Login Cliente**: `POST /auth/login` con credenciales de cliente.
* **Listar pagos**, **crear pago**, **ver pago**, **actualizar estado**, **reembolsar** y **eliminar**: comandos `curl` con el token en header `Authorization: Bearer <token>`.

---

### 5. Confirmación de Cumplimiento

* Todos los métodos **GET**, **PUT**, **PATCH**, **DELETE** (excepto **POST**) ahora filtran según usuario logueado.
* El administrador conserva la capacidad de ver y gestionar todos los registros sin filtros.
* La solución es modular, mantiene los controllers y servicios limpios, y reutiliza código.

----------------------------------
Use el archivo "init-users.sql" para cargar usuarios y probar si funcionaba todo
No me dejaba cargarlos directamente con el "docker-compose.yml" asi que los cargue a mano con:
docker exec -i postgres-db3 psql -U postgres -d ordenes_pagos < init.sql
docker exec -i postgres-db3 psql -U postgres -d ordenes_pagos < init-users.sql
