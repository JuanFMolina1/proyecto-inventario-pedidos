# Documentación Técnica

## 1. Descripción General

El proyecto es un sistema web de gestión de inventario y pedidos con arquitectura separada en dos capas principales:

- `backend`: API REST en Node.js, Express y TypeScript.
- `frontend`: interfaz en React + Vite.

El sistema permite administrar clientes, artículos, fábricas, direcciones, pedidos, relaciones de stock por fábrica y consultas asistidas por inteligencia artificial en lenguaje natural.

### Objetivo funcional

Centralizar la operación comercial de una empresa que necesita:

- Registrar y consultar clientes.
- Controlar inventario por fábrica.
- Gestionar pedidos con detalle de artículos.
- Relacionar artículos con fábricas alternativas.
- Consultar la base de datos mediante IA.

---

## 2. Arquitectura General

### 2.1 Visión de alto nivel

```
Usuario
  -> Frontend React
  -> API REST Express
  -> MySQL
  -> Respuesta al frontend
```

### 2.2 Componentes principales

- **Frontend**
  - Construido con React.
  - Navegación por rutas.
  - Formulario y tablas para CRUD.
  - Dashboard con métricas y gráficas.
  - Módulo de IA con respuestas renderizadas en Markdown.

- **Backend**
  - Exposición de endpoints REST.
  - Patrón MVC simplificado.
  - Servicios con lógica de negocio.
  - Acceso a datos mediante `mysql2`.
  - Integración con OpenAI para consultas en lenguaje natural.

- **Base de datos**
  - Esquema relacional en MySQL.
  - Normalización en 3FN.
  - Tablas con claves primarias, foráneas, índices y restricciones.

### 2.3 Estilo arquitectónico

El sistema sigue una arquitectura de capas:

- **Presentación**: páginas, componentes y estilos en frontend.
- **Controladores**: reciben y validan requests HTTP.
- **Servicios**: encapsulan lógica de negocio.
- **Persistencia**: modelos y consultas SQL.
- **Integración externa**: OpenAI para IA.

---

## 3. Stack Tecnológico

### Backend

- Node.js
- Express.js
- TypeScript
- MySQL
- `mysql2`
- `openai`
- `dotenv`

### Frontend

- React 19
- Vite
- React Router
- Axios
- Recharts
- `react-markdown`
- `remark-gfm`

### Infraestructura y soporte

- `docker-compose.yml` disponible en la raíz del proyecto.
- Variables de entorno para configuración local.

---

## 4. Estructura del Proyecto

### 4.1 Backend

```
backend/
├── database/
│   └── scheme.sql
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── index.ts
└── package.json
```

### 4.2 Frontend

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── styles/
├── public/
└── package.json
```

---

## 5. Modelo de Datos

El esquema relacional está definido en `backend/database/scheme.sql`.

### 5.1 Tablas maestras

- `clientes`
  - Datos comerciales del cliente.
  - Incluye saldo, límite de crédito y descuento.

- `articulos`
  - Catálogo de productos.
  - Contiene nombre y descripción.

- `fabricas`
  - Registro de fábricas proveedoras.
  - Contiene nombre y teléfono.

### 5.2 Tablas dependientes

- `direcciones`
  - Relación 1 a N con clientes.
  - Cada dirección pertenece a un cliente.

- `articulo_fabrica`
  - Relación N a M entre artículos y fábricas.
  - Guarda existencias y precio por fábrica.

- `articulo_fabrica_alternativa`
  - Subconjunto de fábricas alternativas por artículo.

- `pedidos`
  - Cabecera del pedido.
  - Relaciona cliente y dirección.

- `detalle_pedido`
  - Líneas del pedido.
  - Relaciona pedido con artículo y cantidad.

### 5.3 Reglas relevantes del esquema

- Claves primarias en todas las entidades.
- Claves foráneas para integridad referencial.
- Restricciones `CHECK` para validar montos y cantidades.
- Índices para consultas frecuentes.
- Relaciones únicas donde aplica, por ejemplo en el detalle del pedido.

---

## 6. Backend

## 6.1 Entrada principal

- `backend/index.ts`
  - Inicializa Express.
  - Registra JSON middleware.
  - Monta rutas principales.
  - Expone la API en el puerto configurado por `LOCAL_PORT`.

### 6.2 Capas internas

#### Controllers

Reciben la petición HTTP, validan datos y responden con JSON.

Ejemplos:

- `cliente.controller.ts`
- `articulo.controller.ts`
- `fabrica.controller.ts`
- `direccion.controller.ts`
- `pedido.controller.ts`
- `detalle-pedido.controller.ts`
- `ai.controller.ts`

#### Services

Encapsulan la lógica de negocio y el acceso a datos.

Ejemplos:

- `cliente.service.ts`
- `articulo.service.ts`
- `pedido.service.ts`
- `ai.service.ts`

#### Models

Realizan consultas SQL directas sobre MySQL.

### 6.3 Funcionalidades del backend

- CRUD completo para clientes.
- CRUD completo para artículos.
- CRUD completo para fábricas.
- CRUD completo para direcciones.
- CRUD de pedidos.
- CRUD de detalle de pedido.
- CRUD de relación artículo-fábrica.
- CRUD de fábricas alternativas.
- Endpoint de IA para consultas en lenguaje natural.

### 6.4 Lógica destacada

#### Gestión de pedidos

Al crear un pedido, el backend:

- valida existencia de cliente y dirección,
- verifica stock suficiente,
- descuenta inventario,
- actualiza saldo del cliente,
- registra cabecera y detalle del pedido.

#### Gestión de artículos

La creación de artículos puede asociar automáticamente fábrica, existencias y precio, según el flujo del formulario y el servicio correspondiente.

---

## 7. Módulo de Inteligencia Artificial

### 7.1 Objetivo

Permitir consultas en lenguaje natural sobre la base de datos.

### 7.2 Endpoints

- `POST /api/ai/query`
- `GET /api/ai/health`
- `GET /api/ai/info`

### 7.3 Flujo interno

1. El usuario envía una pregunta en español.
2. El backend obtiene el esquema activo de la base de datos.
3. OpenAI recibe el contexto del esquema.
4. El modelo genera una consulta SQL.
5. El backend ejecuta el SQL.
6. OpenAI interpreta el resultado.
7. El frontend muestra la respuesta en formato Markdown.

### 7.4 Características del servicio

- Usa contexto real del esquema.
- Incluye tablas, columnas, claves foráneas e índices.
- Verifica si existe `OPENAI_API_KEY`.
- Expone estado y metadatos del servicio.
- Bloquea múltiples sentencias SQL como medida básica de seguridad.

### 7.5 Interfaz en frontend

La respuesta de IA se renderiza con Markdown para soportar:

- títulos,
- listas,
- tablas,
- citas,
- bloques de código,
- enlaces.

---

## 8. Frontend

### 8.1 Estructura general

El frontend se organiza por responsabilidad:

- `layouts`: estructura global de navegación.
- `pages`: vistas principales.
- `components`: piezas reutilizables.
- `services`: consumo de API.
- `styles`: CSS modular por pantalla o bloque.

### 8.2 Layout principal

`MainLayout.jsx` define:

- barra lateral de navegación,
- encabezado dinámico por ruta,
- contenedor principal para las páginas.

### 8.3 Rutas de la aplicación

- `/` y `/dashboard`
- `/clientes`
- `/articulos`
- `/fabricas`
- `/direcciones`
- `/pedidos`
- `/ia`

### 8.4 Páginas principales

- **Dashboard**
  - KPIs del negocio.
  - Gráficas de pedidos, top productos y top clientes.
  - Tabla paginada de pedidos.
  - Burbuja de IA integrada.

- **Clientes**
  - Listado, alta, edición y eliminación.

- **Artículos**
  - Listado y gestión de artículos.

- **Fábricas**
  - Administración de fábricas proveedoras.

- **Direcciones**
  - Gestión de direcciones por cliente.

- **Pedidos**
  - Creación de pedidos con carrito y detalles.

- **Inteligencia Artificial**
  - Panel dedicado para consultar la base de datos con IA.

### 8.5 Servicios frontend

`frontend/src/services/api.js` centraliza las llamadas HTTP:

- clientes
- artículos
- fábricas
- direcciones
- pedidos
- IA

### 8.6 Visualización

El dashboard usa gráficas para:

- pedidos por día,
- productos más vendidos,
- top de clientes,
- stock por fábrica.

---

## 9. Funcionalidades del Sistema

### 9.1 Gestión de clientes

- Crear cliente.
- Listar clientes.
- Editar datos comerciales.
- Eliminar cliente.
- Consultar su saldo y límite de crédito.

### 9.2 Gestión de artículos

- Crear artículo.
- Listar artículos.
- Editar artículo.
- Eliminar artículo.
- Asociar con fábrica y stock.

### 9.3 Gestión de fábricas

- Crear fábrica.
- Listar fábricas.
- Editar fábrica.
- Eliminar fábrica.

### 9.4 Gestión de direcciones

- Crear dirección asociada a cliente.
- Listar direcciones.
- Eliminar dirección.

### 9.5 Gestión de pedidos

- Crear pedido con múltiples ítems.
- Visualizar detalles del pedido.
- Consultar pedidos por cliente.
- Ver pedidos recientes y paginados.

### 9.6 Inventario

- Consultar stock por fábrica.
- Asociar artículos a fábricas alternativas.
- Controlar existencias por relación artículo-fábrica.

### 9.7 Dashboard analítico

- Métricas de operación.
- Estadísticas de pedidos.
- Visualización de productos y clientes con mayor movimiento.

### 9.8 IA conversacional

- Consultas en lenguaje natural.
- Generación automática de SQL.
- Interpretación de resultados.
- Visualización de SQL generado.
- Render Markdown de respuestas.

---

## 10. Casos de Uso

### 10.1 Actor: Administrador

#### Caso de uso: gestionar clientes

- Objetivo: mantener el padrón de clientes actualizado.
- Resultado: clientes creados, editados o eliminados.

#### Caso de uso: gestionar inventario

- Objetivo: actualizar artículos, fábricas y stock.
- Resultado: inventario consistente y visible en dashboard.

#### Caso de uso: revisar métricas

- Objetivo: observar el estado general del negocio.
- Resultado: decisiones operativas más rápidas.

### 10.2 Actor: Operador de ventas

#### Caso de uso: crear pedido

- Objetivo: registrar una venta con sus ítems.
- Precondiciones: cliente, dirección y artículos disponibles.
- Resultado: pedido registrado, stock ajustado y saldo actualizado.

#### Caso de uso: consultar pedidos

- Objetivo: ver pedidos recientes o filtrar información.
- Resultado: trazabilidad de la operación comercial.

### 10.3 Actor: Analista

#### Caso de uso: consultar datos con IA

- Objetivo: hacer preguntas como si fuera un asistente.
- Resultado: SQL generado, interpretación en lenguaje natural y datos crudos.

#### Caso de uso: reportes ad hoc

- Objetivo: obtener análisis sin escribir SQL manualmente.
- Resultado: consultas complejas resueltas más rápido.

### 10.4 Actor: Soporte técnico

#### Caso de uso: verificar estado de IA

- Objetivo: comprobar si OpenAI está disponible.
- Resultado: estado operativo o degradado.

#### Caso de uso: revisar configuración

- Objetivo: validar que las variables de entorno estén listas.
- Resultado: diagnóstico rápido del servicio.

---

## 11. Flujo de Datos

### 11.1 Flujo CRUD

```
Pantalla -> API Service -> Endpoint -> Controller -> Service -> Model -> MySQL
```

### 11.2 Flujo de pedido

```
Usuario crea pedido
-> frontend envía datos
-> backend valida
-> backend descuenta stock
-> backend actualiza saldo
-> backend guarda pedido
-> frontend refresca vista
```

### 11.3 Flujo de IA

```
Usuario escribe pregunta
-> frontend llama /api/ai/query
-> backend obtiene esquema
-> OpenAI genera SQL
-> backend ejecuta SQL
-> OpenAI interpreta resultados
-> frontend renderiza Markdown
```

---

## 12. Configuración

### 12.1 Variables de entorno del backend

Ejemplo:

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inventario_db
LOCAL_PORT=3000
OPENAI_API_KEY=sk-tu-api-key-aqui
OPENAI_MODEL=gpt-4o-mini
```

### 12.2 Variables de entorno del frontend

El frontend usa:

- `VITE_API_URL` para apuntar al backend, opcional.

### 12.3 Puertos y comunicación

- Backend: `http://localhost:3000`
- Frontend: puerto de Vite
- El frontend proxya `/api` hacia el backend durante desarrollo.

---

## 13. Consideraciones de Seguridad

### 13.1 Base de datos

- El sistema depende de integridad referencial.
- Las operaciones de pedido afectan stock y saldo.
- Es recomendable usar respaldos periódicos.

### 13.2 IA

- El endpoint de IA tiene alto poder de modificación.
- Debe usarse con precaución en producción.
- Se recomienda autorización antes de operaciones destructivas.
- Actualmente existe una validación básica para evitar múltiples sentencias.

### 13.3 Variables sensibles

- La API key de OpenAI no debe exponerse en repositorios públicos.
- Se recomienda rotar cualquier credencial comprometida.

---

## 14. Limitaciones Actuales

- No hay autenticación ni autorización implementadas.
- La IA depende de conectividad y cuota de OpenAI.
- No se ve un sistema formal de auditoría de cambios.
- La validación de SQL generado por IA es básica, no exhaustiva.

---

## 15. Mantenibilidad y Evolución

### 15.1 Puntos fuertes

- Separación clara frontend/backend.
- Código organizado por capas.
- Esquema de base de datos explícito.
- UI modular por páginas y componentes.

### 15.2 Extensiones recomendadas

- Autenticación con roles.
- Logging de operaciones sensibles.
- Auditoría de consultas IA.
- Confirmación antes de operaciones destructivas.
- Exportación de reportes.
- Caché para métricas del dashboard.

---

## 16. Resumen Final

Este proyecto implementa un sistema completo de inventario y pedidos con:

- gestión CRUD del negocio,
- dashboard analítico,
- persistencia en MySQL,
- integración con OpenAI,
- interfaz conversacional de IA,
- arquitectura modular y fácil de mantener.

La solución está pensada para escalar funcionalmente y para servir como base de un sistema comercial más robusto con autenticación, auditoría y controles adicionales.

